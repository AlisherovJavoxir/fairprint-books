const { on } = require('nodemon');
const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const commands = require('./commands')

var pages;
var acceptNumber = false;

const bot = new Telegraf(process.env.Token) 

bot.start(async (ctx) => {
    try {
        await ctx.replyWithHTML(`Assalomu alaykum. <b>"Fair Print"</b> botga xush kelibsiz.`, Markup.inlineKeyboard(
            [
                [Markup.button.callback('Hisoblash','countBtn')]
            ]
        ))
    } catch(e){
        console.error(e);
    }
})
bot.help((ctx) => ctx.replyWithHTML(commands.commands, {
    disable_web_page_preview: true
}))

function addAction(name,text){
    bot.action(name, async (ctx) => {
        try {
            acceptNumber = true;
            await ctx.answerCbQuery()
            await ctx.reply(text)
            bot.on('message', (ctx) => {
                if(Number(ctx.update.message.text)){
                    pages = ctx.update.message.text
                    if(acceptNumber == true){
                        ctx.replyWithHTML("Kitobingiz qanday ko'rinishda bo'lishini istaysiz?", Markup.inlineKeyboard(
                            [
                                [Markup.button.callback('Rangsiz A4','noneA4'), Markup.button.callback('Rangsiz A5','noneA5')],
                                [Markup.button.callback('Rangli A4','colorA4'), Markup.button.callback('Rangli A5','colorA5')]
                            ]
                        ))  
                        function addFormat(format, price, size, color, cover){  
                            bot.action(format, async (ctx) => {
                                try {
                                    ctx.answerCbQuery()
                                    let curPages = pages * price
                                    let allPrices = curPages + cover
                                    ctx.replyWithHTML(`<b>📃 Buyurtma qo'gozi</b>\n\n<b>📖 Kitobingiz sahifalari:</b> ${pages}\n<b>📄 Kitobingiz turi:</b> ${color}\n<b>📘 Kitobingiz hajmi:</b> ${size}\n\n<b>💰 Umumiy narx:</b> ${curPages} so'm \n<b>📕 "Переплет" va "Термоклей" bilan:</b> ${allPrices} so'm\n\n<b>❕ Iltimos, botni yangilang - /start</b>`, Markup.inlineKeyboard([
                                        [Markup.button.urlButton('Buy','https://t.me/fair_print')]
                                    ]), {
                                        disable_web_page_preview: true
                                    }, orderBtn)
                                    pages = 0
                                }
                                catch (e){
                                    console.error(e)
                                }
                            })
                        }
                        addFormat("noneA4", 100, "A4", "Oq-qora", 8000)
                        addFormat("noneA5", 50, "A5", "Oq-qora", 6000)
                        addFormat("colorA4", 150, "A4", "Rangli", 8000)
                        addFormat("colorA5", 100, "A5", "Rangli", 6000)
                        acceptNumber = false
                    }
                } else {
                    ctx.reply('❕ Iltimos, biron-bir son kiriting.')
                }
            })
        } catch(e){
            console.error(e);   
        }
    })
}

addAction('countBtn','Kitob necha sahifadan iborat?')

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))