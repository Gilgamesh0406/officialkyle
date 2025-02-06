const {
  loadCases,
  loadHistory,
  getCases,
  generateTickets,
  generateSpinner,
  openCase,
} = require("../services/unboxingService");

const { getItems } = require("../services/itemService");

const { updateLevel } = require("../services/bettingService");

const {
  calculateLevel,
  getFormatAmount,
  getFormatAmountString,
  roundedToFixed,
  getColorByQuality,
} = require("../utils/helpers");

const config = require("../config");

module.exports = async (socket, io, request) => {
  const { type, command, id } = request;
  const user = socket.user;

  if (type == "unboxing") {
    const unboxingCases = getCases();

    const caseDetails = unboxingCases.find((caseItem) => caseItem.id == id);

    const items = getItems(caseDetails.items);

    if (command == "show") {
      const tickets = generateTickets(items);

      const formattedItems = items.map((item, index) => ({
        name: item.name,
        image: item.image,
        price: getFormatAmount(item.price),
        chance: roundedToFixed(item.chance, 5),
        color: getColorByQuality(item.quality),
        tickets: tickets[index],
      }));

      socket.emit("message", {
        type: "unboxing",
        command: "show",
        items: formattedItems,
        unboxing: {
          id,
          name: caseDetails.name,
          price: getFormatAmount(caseDetails.price),
        },
      });
    } else if (command == "spinner") {
      const { amount } = request;

      const spinners = [];

      for (let i = 0; i < amount; i++) {
        spinners.push(generateSpinner(items));
      }

      socket.emit("message", {
        type: "unboxing",
        command: "spinner",
        spinner: spinners,
      });
    } else if (command == "demo") {
      const { amount } = request;

      const winnings = await openCase(user, id, amount, io, "demo");
      if (!winnings) {
        console.log(
          "[UNBOXING] Error opening case: winnings undefined. for user: ",
          user
        );
        return;
      }
      const spinnerData = winnings.map((win) => win.spinner);

      socket.emit("message", {
        type: "unboxing",
        command: "roll",
        spinner: spinnerData,
      });

      setTimeout(() => {
        socket.emit("message", {
          type: "unboxing",
          command: "finish",
        });
      }, 5000);
    } else if (command == "open") {
      const { amount } = request;

      const winnings = await openCase(user, id, amount, io, "unboxing");
      if (!winnings) {
        console.log(
          "[UNBOXING] Error opening case: winnings undefined. for user: ",
          user
        );
        return;
      }
      const spinnerData = winnings.map((win) => win.spinner);

      socket.emit("message", {
        type: "unboxing",
        command: "roll",
        spinner: spinnerData,
      });

      setTimeout(() => {
        socket.emit("message", {
          type: "unboxing",
          command: "finish",
        });

        winnings.forEach((win) => {
          const winning = getFormatAmount(win.winning.price);

          const history = {
            user: {
              userid: user.userid,
              name: user.name,
              avatar: user.avatar,
              level: calculateLevel(user.xp).level,
            },
            unboxing: {
              id,
              name: caseDetails.name,
              image: caseDetails.image,
              price: getFormatAmount(caseDetails.price),
            },
            winning: win.winning,
          };

          io.sockets.in("unboxing").emit("message", {
            type: "unboxing",
            command: "history",
            history,
          });

          if (winning >= config.games.winning_to_chat) {
            const send_message = `${user.name} won ${getFormatAmountString(
              winning
            )} in unboxing with a chance of ${roundedToFixed(
              win.winning.chance,
              2
            ).toFixed(2)}%!`;
            otherMessages(send_message, io.sockets, true);
          }

          console.log(
            `[UNBOXING] Win registered. ${
              user.name
            } won $${getFormatAmountString(
              winning
            )} with a chance of ${roundedToFixed(win.winning.chance, 2).toFixed(
              2
            )}%`
          );
        });

        updateLevel(user.userid, io);
      }, 8000);

      console.log(
        `[UNBOXING] Bet registered. ${
          user.name
        } opened a case for $${getFormatAmountString(
          amount * caseDetails.price
        )}`
      );
    }
  }
};
