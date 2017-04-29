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

  //Takes a Date object, defaults to current date. Appears at bottom.
  .setTimestamp()

  //the URL for the title and author.
  .setURL('https://discord.js.org/#/docs/main/indev/class/RichEmbed')

  .addField('Inline Field', 'They can also be inline.', true)



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

        // Exit and stop if no prefix.
        //if(!msg.content.startsWith(prefix)) return; 
        
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

        //look for PCPP links
        if(msg.content.includes("https://pcpartpicker.com/list"))
        {
            //test
            var orgMessage = msg.content.toString();
            var pos = orgMessage.search('https://pcpartpicker.com/list');
            console.log(pos);
            var sliceMessage = orgMessage.substring(pos, (pos + 36));
            console.log(sliceMessage);
            driver.get(sliceMessage);
            driver.manage().timeouts().implicitlyWait(100000);
            //endTest
            //Webdriver goes to work, start with retrive title
            driver.getTitle().then(function(title) 
            {
                embed.setAuthor(msg.author.username, msg.author.avatarURL);
                embed.setTitle(sliceMessage);
                embed.setURL(sliceMessage);
/*                var cpuElement = driver.findElement(By.linkText('CPU'));
                cpuElement.getText().then(text => console.log(`Text is ` + text));*/

                var bbElement = driver.findElement(By.className("markup_bbcode"));
                bbElement.click();
                //driver.switchTo().activeElement();
                var bbTextArea = driver.findElement(By.id("markup_text"));
                //var text = bbTextArea.getText();
                console.log(bbTextArea);
                //msg.channel.sendMessage(text);

                //send message when done

                msg.channel.sendEmbed(embed, { disableEveryone: true });
                console.log('Page title is: ' + title);
            });
            return;
        }
    }
)

bot.login(settings.token);