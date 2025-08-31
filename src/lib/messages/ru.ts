export const ruMessage = {
    bot: {
        commandDescriptions: {
            start: "ПОЛУЧИТЬ кнопку онлайн-магазина.",
        },
        answersToCommand: {
            start: "🛍 Наш интернет-магазин 🛍",
        },
        buttons: {
            visit: "ПОСМОТРЕТЬ",
        },
        orderAccepted: "🎉Ваш заказ принят на обработку.🎉",
        adminChat: {
            msgIncomingInvoice: (
                username: string | undefined,
                has_private_forwards: true | undefined,
                id: number,
                first_name = ""
            ) => {
                if (username) {
                    return `🤑 У нас новый заказ от пользователя <a href="https://t.me/${username}">${first_name}</a>`;
                }
                if (!username && !has_private_forwards) {
                    return `🤑 У нас новый заказ от пользователя <a href="tg://user?id=${id}">${first_name}</a>`;
                }

                return "🤑 У нас новый заказ, но настройки конфиденциальности пользователя 🥷🏻 не позволяют поделиться его профилем.";
            },
        },
    },
    excel: {
        headers: {
            Brand: "Бренд",
            Name: "Название",
            For: "Для Модели",
            Color: "Цвет",
            Quantity: "Количество",
            Capacity: "Емкость",
            Price: "Цена",
            Subtotal: "Сумма",
            Total: "Итого",
            "Cable Type": "Тип кабеля",
            "Cable Length": "Длина кабеля",
            "Cable Wattage": "Ватт кабеля",
            Attributes: "Характиристики",
        },
    },
    client: {
        product: {
            Brand: "Бренд",
            Name: "Название",
            For: "Для Модели",
            ["For Device"]: "Для Модели",
            Color: "Цвет",
            Quantity: "Кол-во",
            Capacity: "Емкость",
            Price: "Цена",
            Subtotal: "Сумма",
            Total: "Итого",
        },
    },
};
