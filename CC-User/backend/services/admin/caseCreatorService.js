const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const ItemsList = require('../../models/ItemsList');
const Cases = require('../../models/Cases');
const config = require('../../config');
const { roundedToFixed, getFormatAmount, time, getColorByQuality } = require('../../utils/helpers');
const { getItemDetails } = require('../itemService');
const { unboxingCases, addCase } = require('../unboxingService');
const { dailyCases } = require('../dailyCaseService');
const DailyCases = require('../../models/DailyCases');

const validateCaseData = (name, image, items, data, creator) => {
    name = name.trim();
    const { min, max } = config.rewards.admin.casecreator_requirements.name_length;

    if(name.length < min || name.length > max) {
        return 'Error: Invalid name length.!';
    }

    if(!/^[a-zA-Z0-9\s~`!@#\$%^&*()\-_+={[}\]|\\:;"'<,>.?\/]+$/.exec(name)) {
        return 'Error: Invalid name characters.!';
    }

    if(!Buffer.isBuffer(image)) {
        return 'Error: Invalid image.!';
    }

    const magicNumber = image.toString('hex', 0, 4);
    const allowedExtensions = ['89504e47', 'ffd8ffe0', 'ffd8ffe1'];

    if(!allowedExtensions.includes(magicNumber)) {
        return 'Error: Invalid image format!';
    }

    const { items_length } = config.rewards.admin.casecreator_requirements;
    if(items.length < items_length.min || items.length > items_length.max) {
        return 'Error: Invalid items amount.!';
    }

    if(creator == 'cases') {
        if(isNaN(Number(data.offset))) {
            return 'Error: Invalid offset.!';
        }

        const offset = roundedToFixed(data.offset, 2);
        const { unboxing  } = config.rewards.admin.casecreator_requirements;
        if(offset < unboxing.offset.min || offset > unboxing.offset.max) {
            return 'Error: Invalid offset.!';
        }

        if(isNaN(Number(data.battle))) {
            return 'Error: Invalid battle.!';
        }
    
        const battle = parseInt(data.battle);
        const allowedCaseBattle = [0, 1];
    
        if(!allowedCaseBattle.includes(battle)) {
            return 'Error: Invalid battle.!';
        }
    } else if(creator == "dailycases") {
        if(isNaN(Number(data.level))) {
            return 'Error: Invalid level.!';
        }

        const level = parseInt(data.level);
        const { min, max } = config.rewards.admin.casecreator_requirements.dailycases.level;

        if(level < min || level > max) {
            return `Error: Invalide level [${min} - ${max}]`
        }
    }

    let available = true;
    let chance = 0;
    const availableItems = [];

    items.forEach(item => {
        if(getItemDetails(item.id) == undefined)
            available = false;
        if(item.chance <= 0)
            available = false;

        const itemChance = roundedToFixed(item.chance, 5);
        chance = roundedToFixed(chance + itemChance, 5);

        if(!availableItems.includes(item.id))
            availableItems.push(item.id);
    });

    if(!available) {
        return 'Error: Invalid items.!';
    }

    if(availableItems.length != items.length) {
        return 'Error: Invalid items.!';
    }

    if(chance != 100) {
        return 'Error: Invalid chance.!';
    }

    return null;
}

const saveCase = async (name, image, items, data, socket) => {
    const magicNumber = image.toString('hex', 0, 4);
    const extension = { '89504e47': 'png', 'ffd8ffe0': 'jpg', 'ffd8ffe1': 'jpg' }[magicNumber];

    const caseId = name.replace(/[^\w\s\-]/gi, '').trim().replace(/[\s\-_]+/g, '_').toLowerCase();
    const caseImage = caseId + '.' + extension;

    const existingCase = await Cases.findOne({ where: { caseid: caseId, removed: 0 } });

    if(existingCase) {
        socket.emit('message', {
            type: 'error',
            error: 'A case with this name already created!'
        });
        return null;
    }

    let price = 0;
    const newItems = items.map(item => {
        const itemPrice = getFormatAmount(getItemDetails(item.id).price);
        const itemChance = roundedToFixed(item.chance, 5);
        price += itemPrice * itemChance / 100
        
        return {
            id: item.id,
            chance: itemChance
        };
    });

    newItems.sort((a, b) => getItemDetails(b.id).price - getItemDetails(a.id).price);

    price = getFormatAmount(price * (1 + data.offset / 100));

    const imagePath = path.join(config.site.frontend, config.site.root, 'template/img/cases', caseImage);
    await fs.promises.writeFile(imagePath, image);

    const newCase = await Cases.create({
        caseid: caseId,
        items: JSON.stringify(newItems),
        name: name,
        image: caseImage,
        offset: data.offset,
        battle: data.battle,
        time: time()
    });

    addCase({
        caseid: caseId,
        items: newItems,
        name: name,
        image: caseImage,
        offset: data.offset,
        battle: data.battle,
        price: price,
        category: 0,
    });

    return {
        name: newCase.name,
        image: newCase.image,
        price: price,
        category: 0,
        items: newItems
    }
}

const getCases = async (creator) => {
    let cases;

    if(creator == "cases") {
        cases = await Cases.findAll({
            where: {
                removed: 0
            }
        });
    } else if(creator == "dailycases") {
        cases = await DailyCases.findAll({
            where: {
                removed: 0
            }
        });
    }

    return cases.map(caseItem => ({
        id: caseItem.caseid,
        name: caseItem.name,
        image: caseItem.image,
        price: getFormatAmount(caseItem.price)
    }));
}

const editCase = async (id, name, image, items, data, creator, socket) => {
    const magicNumber = image.toString('hex', 0, 4);
    const extension = { '89504e47': 'png', 'ffd8ffe0': 'jpg', 'ffd8ffe1': 'jpg' }[magicNumber];

    const caseId = name.replace(/[^\w\s\-]/gi, '').trim().replace(/[\s\-_]+/g, '_').toLowerCase();
    const caseImage = caseId + '.' + extension;

    let existingCase = null;
    let duplicateCase = null;

    if(creator == 'cases') {
        existingCase = await Cases.findOne({ where: { caseid: id, removed: 0 } });
    } else if(creator == 'dailycases') {
        existingCase = await DailyCases.findOne({ where: { caseid: id, removed: 0 } });
    }

    if(!existingCase) {
        return null;
    }

    if(creator == 'cases') {
        duplicateCase = await Cases.findOne({ where: { caseid: caseId, removed: 0, id: { [Op.ne]: existingCase.id } } });
    } else if(creator == 'dailycases') {
        duplicateCase = await DailyCases.findOne({ where: { caseid: caseId, removed: 0, id: { [Op.ne]: existingCase.id } } });
    }

    if(duplicateCase) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: A case with this name already created!'
        });
        return null;
    }

    if(creator == 'cases') {
        delete unboxingCases[existingCase.caseid];
    } else if(creator == 'dailycases') {
        delete dailyCases[existingCase.caseid];
    }

    let price = 0;
    const newItems = items.map(item => {
        const itemDetails = getItemDetails(item.id);
        const itemPrice = getFormatAmount(itemDetails.price);
        const itemChance = roundedToFixed(item.chance, 5);
        price += itemPrice * itemChance / 100;

        return {
            id: item.id,
            chance: itemChance
        }
    });

    newItems.sort((a, b) => getItemDetails(b.id).price - getItemDetails(a.id).price);
    price = getFormatAmount(price * (1 + data.offset / 100));

    const imagePath = path.join(config.site.frontend, config.site.root, 'template/img/cases', caseImage);

    await fs.promises.unlink(path.join(config.site.frontend, config.site.root, 'template/img/cases', existingCase.image));
    await fs.promises.writeFile(imagePath, image);

    existingCase.caseId = caseId;
    existingCase.name = name;
    existingCase.image = caseImage;
    existingCase.items = JSON.stringify(newItems);

    if(creator == 'cases') {
        existingCase.offset = data.offset;
        existingCase.battle = data.battle;
    }

    await existingCase.save();

    if(creator == 'cases') {
        return {
            id: existingCase.caseid,
            name: existingCase.name,
            image: existingCase.image,
            items: newItems,
            price: price
        }
    } else if(creator == 'dailycases') {
        return {
            id: existingCase.caseid,
            name: existingCase.name,
            image: existingCase.image,
            items: newItems,
            level: data.level
        }
    }
}

const getCaseDetails = async (id) => {
    const caseRecord = await Cases.findOne({
        where: {
            caseid: id,
            removed: 0
        }
    });

    if(!caseRecord) {
        return null;
    }

    const items = JSON.parse(caseRecord.items);
    const newItems = [];

    for(const item of items) {
        const itemDetails = await ItemsList.findOne({
            where: {
                itemid: item.id
            }
        });

        if(!itemDetails) {
            return null;
        }

        newItems.push({
            item: {
                id: item.id,
                name: itemDetails.name,
                image: itemDetails.image,
                price: itemDetails.price,
                color: getColorByQuality(itemDetails.quality)
            },
            chance: roundedToFixed(item.chance, 5)
        });
    }

    const imagePath = path.join(config.site.frontend, config.site.root, 'template/img/cases', caseRecord.image);
    const imageBuffer = await fs.promises.readFile(imagePath);

    return {
        name: caseRecord.name,
        image: caseRecord.image,
        items: newItems,
        buffer: imageBuffer,
        battle: parseInt(caseRecord.battle),
        offset: roundedToFixed(caseRecord.offset, 2)
    }
}

const removeCase = async (id, creator) => {
    let caseToRemove;

    if(creator == 'cases') {
        caseToRemove = await Cases.findOne({ where: { caseid: id, removed: 0 } });
    } else if(creator == 'dailycases') {
        caseToRemove = await DailyCases.findOne({ where: { caseid: id, removed: 0 } });
    }

    if(!caseToRemove) {
        return null;
    }

    delete unboxingCases[id];

    await caseToRemove.update({ removed: 1 });

    return caseToRemove;
}

module.exports = {
    validateCaseData,
    saveCase,
    getCases,
    editCase,
    getCaseDetails,
    removeCase
}