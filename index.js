const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const commands = require('./commands')
const bot = new Telegraf(process.env.Token) 

var acceptNumber = false;
var pages = 0;
var priceOfPages = 0;
var format = 0;
var finalPrice = 0;
var colorFormat;
var cover;
var sizeFormat;

bot.start(async (ctx) => {
    await ctx.replyWithHTML(`Assalomu alaykum. <b>"Fair Print"</b> botga xush kelibsiz.`, Markup.inlineKeyboard(
        [
            [Markup.button.callback('Hisoblash','countBtn')]
        ]
        ))
    })
bot.help((ctx) => ctx.replyWithHTML(commands.commands, {
    disable_web_page_preview: true
}))

bot.action('countBtn', async (ctx) => {
    acceptNumber = true;
    await ctx.answerCbQuery();
    if(acceptNumber == true){
        ctx.reply('1. Kitob necha sahifadan iborat?');
    }
})

bot.on('message', (ctx) => {
    if (acceptNumber == true) {
        if(Number(ctx.update.message.text)){
            pages = ctx.update.message.text
            ctx.replyWithHTML("2. Kitobingiz qanday ko'rinishda bo'lishini istaysiz?", Markup.inlineKeyboard(
                [
                    [Markup.button.callback('Rangsiz A4','noneA4'), Markup.button.callback('Rangsiz A5','noneA5')],
                    [Markup.button.callback('Rangli A4','colorA4'), Markup.button.callback('Rangli A5','colorA5')]
                ]
            ))
        }
        else {
            ctx.reply('❕ Iltimos, biron-bir son kiriting.')
        }
        acceptNumber = false
    }
    else {
        ctx.reply('Botni qayta ishga tushiring - /start')
    }
})

function formats(name, price, color, size){
    bot.action(name, (ctx) => {
        sizeFormat = size;
        colorFormat = color;
        ctx.answerCbQuery();
        priceOfPages = pages * price;
        ctx.reply("3. Kitobingiz uchun muqova turini tanlang.", Markup.inlineKeyboard(
            [
                [Markup.button.callback(`"Переплет"`,'pp'), Markup.button.callback(`"Термоклей"`,'tk')]
            ]
        ));
    })
}

bot.action('pp', (ctx) => {
    ctx.answerCbQuery();
    cover = `"Переплет"`;
    if (sizeFormat == 4) {
        finalPrice = priceOfPages += 7000
    }
    else {
        finalPrice = priceOfPages += 5000
    }
    ctx.replyWithHTML(`<b>📃 Buyurtma qo'gozi</b>\n\n<b>📖 Kitobingiz sahifalari:</b> ${pages}ta\n<b>📄 Kitobingiz turi:</b> ${colorFormat}\n<b>📘 Kitobingiz hajmi:</b> A${sizeFormat}\n\n<b>💰 Narx:</b> ${pages * price} so'm \n<b>📕 ${cover} bilan:</b> ${finalPrice} so'm\n\n<b><a href="https://t.me/fair_print">🖨 Buyurtma berish</a></b>\n\n<b>❕ Iltimos, botni yangilang - /start</b>`, {
        disable_web_page_preview: true
    })
})

bot.action('tk', (ctx) => {
    ctx.answerCbQuery();
    cover = `"Термоклей"`
    if (sizeFormat == 4) {
        finalPrice = priceOfPages += 8000 
    }
    else {
        finalPrice = priceOfPages += 6000
    }
    ctx.replyWithHTML(`<b>📃 Buyurtma qo'gozi</b>\n\n<b>📖 Kitobingiz sahifalari:</b> ${pages}ta\n<b>📄 Kitobingiz turi:</b> ${colorFormat}\n<b>📘 Kitobingiz hajmi:</b> A${sizeFormat}\n\n<b>💰 Narx:</b> ${pages * price} so'm \n<b>📕 ${cover} bilan:</b> ${finalPrice} so'm\n\n<b><a href="https://t.me/fair_print">🖨 Buyurtma berish</a></b>\n\n<b>❕ Iltimos, botni yangilang - /start</b>`, {
        disable_web_page_preview: true
    })
})

formats('noneA4',100,'rangsiz',4)
formats('noneA5',50,'rangsiz',5)
formats('colorA4',150,'rangli',4)
formats('colorA5',100,'rangli',5)




bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))