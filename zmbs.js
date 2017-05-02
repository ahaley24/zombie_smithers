var Discord = require("discord.js"); //uses discord.js library
const path = require('path');
var bot = new Discord.Client();  //initiate new discord Client
const settings = require('./settings.json')
var webdriver = require('selenium-webdriver'), By = webdriver.By, until = webdriver.until;
var driver = new webdriver.Builder().forBrowser('phantomjs').build();

//
bot.on("ready", () =>
{
    driver.get('http://www.google.com');
    driver.getTitle().then(function(title) 
    {
        console.log('Page title is: ' + title);
    });
});

// Set the prefix
let prefix = "!pcpp ";

//###### EMBED ######

var titleURL;
var titleText;

const embed = new Discord.RichEmbed()
  .setTitle('')
  .setAuthor('Author Name', 'https://i.imgur.com/lm8s41J.png')

  //Alternatively, use '#00AE86', [0, 174, 134] or an integer number.
  .setColor(0x00AE86)

  .addField('Test', 'They can also be inline.', false)

  //Takes a Date object, defaults to current date. Appears at bottom.
  .setTimestamp()

  //the URL for the title and author.
  .setURL('https://discord.js.org/#/docs/main/indev/class/RichEmbed');


//do this whenever a message occurs.
bot.on("message", msg => 
    {
    //###### BASIC SETUP & COMMANDS ###### 

        //boot test
        
        if(msg.content.toLowerCase() === prefix + 'title')
        {
            msg.channel.sendMessage("Test succeeded. Title is " + driver.getTitle().then());
            console.log("Test succeeded.");
        }
        
        // Exit if a bot.
        if(msg.author.bot) return;   

        //shutdown the bot. only responds to me.
        if (msg.content.toLowerCase() === prefix + "shutdown") 
        {
            if (msg.author.id !== "197710242551824384" || "283258123882332161")
            {
                msg.channel.sendMessage("Shutting down...").then(() => { process.exit(); })
            }
            else
            {
                msg.channel.sendMessage("Errm, I cannot do that.")
            }
        }


    //###### PRIMARY FUNCTIONS ######

        //look for PCPP list links
        if(msg.content.includes("https://pcpartpicker.com/list"))
        {

            var orgMessage = msg.content.toString();
            //find start of URL
            var pos = orgMessage.search('https://pcpartpicker.com/list');
            console.log(pos);
            //using start of URL, grab the 36 character length of a list URL
            var sliceMessage = orgMessage.substring(pos, (pos + 36));
            console.log(sliceMessage);
            //navigate to the new URL
            driver.get(sliceMessage);


            //Webdriver goes to work, start with retrive title
            driver.getTitle().then(function(title) 
            {
                embed.setAuthor(msg.author.username, msg.author.avatarURL);
                embed.setTitle(sliceMessage);
                embed.setURL(sliceMessage);
                var cpuElement = driver.findElement(By.xpath('/html/body/div[1]/div[1]/div[3]/div/div/div[1]/div/table/tbody/tr[1]/td[3]'));
                cpuElement.getText().then(text => console.log(`Text is ` + text));

/*                var bbElement = driver.findElement(By.className("markup_bbcode"));
                bbElement.click();
                driver.switchTo().activeElement();
                var bbTextArea = driver.findElement(By.id("markup_text"));
                var text = bbTextArea.getText();
                console.log(bbTextArea);
                msg.channel.sendMessage(text);
*/
                

                msg.channel.sendEmbed(embed, { disableEveryone: true });
                console.log('Page title is: ' + title);
            });
            return;
        }
    }
)

bot.login(settings.token);