const { Op } = require('sequelize');
const ItemList = require('../../models/ItemsList');
const { getColorByQuality, getFormatAmount } = require('../../utils/helpers');
const config = require('../../config');
const {
    validateCaseData,
    saveCase,
    getCases,
    editCase,
    getCaseDetails,
    removeCase
} = require('../../services/admin/caseCreatorService');
const { unboxingCases } = require('../../services/unboxingService');
const { dailyCases } = require('../../services/dailyCaseService');

module.exports = async (socket, io, request) => {
    const { type, command } = request;
    const user = socket.user;

    if(type == "pagination") {
        const { page, order, search } = request;

        if(command == "casecreator_items") {
            if(!config.settings.allowed.admin.includes(user.userid)) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: You do not have permission to use this command.'
                });
                return;
            }

            const orderAllowed = [0, 1, 2, 3];

            if(!orderAllowed.includes(order)) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: Invalid order.'
                });
                return;
            }

            if(isNaN(Number(page))) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: Invalid page.'
                });
                return;
            }

            const itemsPerPage = 100;
            const offset = (page - 1) * itemsPerPage;
            const searchQuery = search.trim();

            const totalCount = await ItemList.count({
                where: {
                    name: {
                        [Op.like]: `%${searchQuery}%`
                    }
                }
            });

            const pages = Math.ceil(totalCount / itemsPerPage);

            if(pages <= 0) {
                socket.emit('message', {
                    type: 'pagination',
                    command: 'casecreator_items',
                    list: [],
                    pages: 1,
                    page: 1
                });

                return;
            }

            if(page <= 0 || page > pages) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: Invalid page.'
                });
                return;
            }

            const orderQuery = {
                0: ['name', 'ASC'],
                2: ['name', 'DESC'],
                3: ['price', 'ASC'],
                4: ['price', 'DESC']
            }[order];

            const items = await ItemList.findAll({
                where: {
                    name: {
                        [Op.like]: `%${searchQuery}%`
                    }
                },
                order: [orderQuery],
                offset,
                limit: itemsPerPage
            });

            const list = items.map(item => ({
                id: item.itemid,
                name: item.name,
                image: item.image,
                price: item.price,
                color: getColorByQuality(item.quality)
            }));

            socket.emit('message', {
                type: 'pagination',
                command: 'casecreator_items',
                list,
                pages,
                page
            });
        }
    }

    if(type == 'admin') {
        if(!config.settings.allowed.admin.includes(user.userid)) {
            socket.emit('message', {
                type: 'error',
                error: 'Error: You do not have permission to use this command.'
            });
            return;
        }

        if(command == "casecreator_create") {
            const { name, image, items, data, secret } = request;

            if(!config.site.access_secrets.includes(secret)) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: Invalid secret.'
                });
                return;
            }

            const validationError = validateCaseData(name, image, items, data);
            if(validationError) {
                socket.emit('message', {
                    type: 'error',
                    error: validationError
                });
                return;
            }

            const caseData = await saveCase(name, image, items, data, socket);

            if(caseData) {
                socket.emit('message', {
                    type: 'success',
                    success: 'Case successfully created!'
                });

                io.sockets.emit('new_case', caseData);
            }
        }

        if(command == "casecreator_cases") {
            const { creator } = request;

            const allowedCreators = ['cases', 'dailycases'];
            if(!allowedCreators.includes(creator)) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: Invalid creator.'
                });
                return;
            }

            const cases = await getCases(creator);
            const listCases = cases.map(caseItem => ({
                id: caseItem.id,
                name: caseItem.name,
                image: caseItem.image,
                price: getFormatAmount(caseItem.price)
            }));

            listCases.sort((a, b) => b.price - a.price);

            socket.emit('message', {
                type: 'casecreator',
                command: 'cases',
                creator,
                cases: listCases
            });
        }

        if(command == "casecreator_get") {
            const { id } = request;
            const caseDetails = await getCaseDetails(id);
            if(!caseDetails) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: Unknown caseid!.'
                });
                return;
            }

            socket.emit('message', {
                type: 'casecreator',
                command: 'case',
                creator: 'cases',
                data: caseDetails
            });
        }

        if(command == "casecreator_edit") {
            const { id, name, image, items, data, secret, creator } = request;

            if(!config.site.access_secrets.includes(secret)) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: Invalid secret.'
                });
                return;
            }

            const validationError = validateCaseData(name, image, items, data, creator);
            if(validationError) {
                socket.emit('message', {
                    type: 'error',
                    error: validationError
                });
                return;
            }

            try {
                const editedCase = await editCase(id, name, image, items, data, creator, socket);

                if(!editedCase) {
                    socket.emit('message', {
                        type: 'error',
                        error: 'Error: Unknown caseid!.'
                    });
                    return;
                }

                if(creator == 'cases') {
                    socket.emit('message', {
                        type:'success',
                        success: 'Case successfully edited!'
                    });

                    socket.emit('message', {
                        type: 'casecreator',
                        command: 'redirect',
                        creator: 'cases',
                        caseid: editedCase.id
                    });

                    unboxingCases[editedCase.id] = {
                        name: editedCase.name,
                        image: editedCase.image,
                        price: editedCase.price,
                        category: 0,
                        items: editedCase.items,
                    }

                } else if(creator == 'dailycases') {
                    socket.emit('message', {
                        type: 'success',
                        success: 'Daily case successfully edited!'
                    });

                    socket.emit('message', {
                        type: 'casecreator',
                        command: 'redirect',
                        creator: 'dailycases',
                        caseid: editedCase.id
                    });

                    dailyCases[editedCase.id] = {
                        name: editedCase.name,
                        image: editedCase.image,
                        items: editedCase.image,
                        level: level
                    }
                }
            } catch(error) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: ' + error.message
                });
            }
        }

        if(command == 'casecreator_remove') {
            const { id, secret, creator } = request;

            if(!config.site.access_secrets.includes(secret)) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: Invalid secret.'
                });
                return;
            }

            try {
                const removedCase = await removeCase(id, creator);
                if(!removedCase) {
                    socket.emit('message', {
                        type: 'error',
                        error: 'Error: Unknown caseid.'
                    });
                    return;
                }

                socket.emit('message', {
                    type: 'casecreator',
                    command: 'remove',
                    id
                });

            } catch(error) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: ' + error.message
                });
            }
        }
    }
}