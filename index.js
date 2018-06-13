const Discord = require("discord.js"); //imports Discord JS

const YTDL = require("ytdl-core");
const TOKEN = ""; //APP ID
const PREFIX ="/";//what "sparks" a command (ex. .add, /help, *ban, etc.)

function randomHex() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}//credit to: https://www.paulirish.com/2009/random-hex-color-code-snippets/

function play(connection, message){
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"})); 

  server.queue.shift();

  server.dispatcher.on("end", function(){
    if(server.queue[0]) play(connection, message);
    else connection.disconnect();
  });
}

var fortunes = ["Yes","No", "Maybe", "Google it"];
var bot = new Discord.Client(); //creates new client, essentially calls a class (in this case, a function)
var servers = {};


bot.on("ready", function() {//when bot is on, console will print "READY"
  console.log("READY");
});

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "general").sendMessage(member.toString() + " Hey Cutie ;)");
    member.addRole(member.guild.roles.find("name", "slave"));
    member.guild.createRole({
        name: member.user.username,
        color: randomHex(),
        permissions: []
    }).then(function(role){
      member.addRole(role);
    });

  });

bot.on("message", function(message) { //when bot is on and message is recieved, we will run this function with parameter "message"
if(message.author.equals(bot.user)) return;

if(!message.content.startsWith(PREFIX)) return;

var args = message.content.substring(PREFIX.length).split(" "); //essentially gets the input and creates an ArrayList

switch(args[0].toLowerCase()) {
   case "ping":   //if message is ping, bot spits out Pong!
     message.channel.sendMessage("Pong!");
    break;

   case "pong":
    message.channel.sendMessage("Ping!");
    break;

   case "info":
     message.channel.sendMessage("I'm your slave.");
     break;

   case "hello":
     message.channel.sendMessage("Hi, there!");
    break;

   case "team7195":
     message.channel.sendMessage("Who?");
    break;

   case "8ball":
    if(args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]); //gets a random answer, math.floor returns the largest int less than or equal to given #
     else  message.channel.sendMessage("I can't read that");
     break;

   case "list":
   var embed = new Discord.RichEmbed()
     .addField("/ping", "Pong!", true)//if true, makes fields on one line. Default is set to FALSE
     .addField("/pong", "Ping!", true)
     .addField("/info", "Returns info on JettyBoi", true)
     .addField("/hello", "Hi, there!", true)
     .addField("/team7195", "Who?", false)
     .addField("/8ball", "returns either: Yes, No, Maybe, Google It", true)
     .addField("/list", "lists commands",true )
     .addField("/senpai", "NANI?", true )
     .setColor(0x00AE86)
     .setFooter("Help Me..")
     .setThumbnail(message.author.avatarURL)
     message.channel.sendEmbed(embed);
    break;

  case "embed":
  var embed = new Discord.RichEmbed()
        .addField("Test Title", "Test Description", true)//if true, makes fields on one line. Default is set to FALSE
        .addField("Test Ti1tle", "Test 3Description", true)
        .addField("Test Tit2le", "Test Desc1ription")
        .setColor(0x00AE86)
        .setFooter("I am thee footer")
        .setThumbnail(message.author.avatarURL)
    message.channel.sendEmbed(embed);
    break;

  case "senpai":
  message.channel.sendMessage(message.author.toString() + " NANI?");
  break;

  case "removerole":
  message.channel.sendMessage("removed");
  message.member.removeRole(member.guild.roles.find("name", "slave"));
  break;

  case "deleterole":
  message.member.guild.roles.find("name", "slave").delete();
  message.channel.sendMessage("delete");
  break;
  case "play":
    if(!args[1]){
      message.channel.sendMessage("Please provide a link");
      return;
    }
    if(!message.member.voiceChannel){
      message.channel.sendMessage("You must be in a voice chat!");
      return;
    }
    if(!servers[message.guild.id]) servers[message.guild.id] = {
      queue: []
    };

    var server = servers[message.guild.id];

    server.queue.push(args[1]);

    if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
      play(connection, message);
    });
   break;

   case "skip":
      var server = servers[message.guild.id];

      if(server.dispatcher) server.dispatcher.end();
   break;

   case "stop":
      var server = servers[message.guild.id];

      if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
  break;
   default:
     message.channel.sendMessage("Invalid command.")

}
});

//Note to self, when attempting to start up the bot, use cd in front of file location, then use node index to make the bot online
//RichEmbed Docs here: https://discord.js.org/#/docs/main/stable/class/RichEmbed
bot.login(TOKEN); //logs bot in with token
