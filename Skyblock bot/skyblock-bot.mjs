//import { access } from "fs";
import { readFile } from "fs/promises";
//import inventoryViewer from "mineflayer-web-inventory";
import chalk from "chalk";
import mineflayer from "mineflayer";
import readline from "readline";
import { getLocation } from "./utils/getLocation.mjs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let botArgs = {
    host: "mc.hypixel.net",
    //host: "192.168.2.11",
    //port:58887,
    version: "1.8.9"
};

const settings = JSON.parse(
    await readFile(
        new URL('./utils/settings.json', import.meta.url)
    )
);

class MCBot {

    async startMacro() {    

        for (let j = 0; j < 3; j++) {
            this.setupCoords(); 
            await new Promise(r => setTimeout(r, 1000));

            for (let i = 0; i < settings["CoordList"].length; i++) {
                this.iteration = i;
                
                await new Promise(r => setTimeout(r, 2000));
                //await this.bot.look(settings["CoordList"][i][2], 0);
                //await this.bot.look(-2.35619449, 0);
                await new Promise(r => setTimeout(r, 500));
                this.bot.setControlState("sneak", true);
                await new Promise(r => setTimeout(r, 300));
                this.bot.setControlState("sneak", false);
                await new Promise(r => setTimeout(r, 100));
/*
                console.log("3");
                await new Promise(r => setTimeout(r, 1000));
                console.log("2");
                await new Promise(r => setTimeout(r, 1000));
                console.log("1");
                await new Promise(r => setTimeout(r, 1000));
*/
                await this.walkInRows(settings["Rows"][i], settings["Movement"][i], settings["CoordList"][i], j+1);
                await new Promise(r => setTimeout(r, 100));
            }

            this.bot.chat("/warp garden");
        }

        this.bot.quit();
    }

    async breakSugarCane() {
        const pos1 = this.bot.entity.position.clone().offset(0, 1, 0);
        const pos2 = pos1.offset(Math.round(Math.sin(settings["CoordList"][this.iteration][2])) * -1, 0, Math.round(Math.cos(settings["CoordList"][this.iteration][2])) * -1); 
        
        if (this.bot.entity.position != null){
            let coords = (this.bot.entity.position.z).toString().split("."); 

            if (this.lastCoor1 != coords[0]){
                if (4 <= parseInt(coords[1][0]) <= 6){
                    const block1 = this.bot.blockAt(pos1);
                    if ( block1 != null){
                        if (block1.name == "reeds") {
                            await this.bot.dig(block1, "ignore");
                            this.bot.waitForTicks(5);
                            this.bot.stopDigging();
                            this.lastCoor1 = coords[0];
                        }
                    }
                }
            }
            if (this.lastCoor2 != coords[0]){
                if (4 < parseInt(coords[1][0]) <= 6){
                    const block2 = this.bot.blockAt(pos2);
                    if ( block2 != null){
                        if (block2.name == "reeds") {
                            await this.bot.dig(block2, "ignore");
                            this.bot.waitForTicks(5);
                            this.bot.stopDigging();
                            this.lastCoor2 = coords[0];
                        }
                    }
                }
            }
        }
    }


    async walk(direction, coords, target, RndTime) {
        const offset = coords[3];
        const startPosition = this.bot.entity.position.z + offset;
        const targetPosition = coords[target] + offset;

        const moveStep = (startPosition < targetPosition) ? 1 : -1;
    
        this.log("Starting moving", 0);
        while (true) {
            if (this.bot.entity.position != null){
                const currentPosition = this.bot.entity.position.z + offset;

                if ((moveStep > 0 && currentPosition >= targetPosition) || (moveStep < 0 && currentPosition <= targetPosition)){
                    await new Promise(r => setTimeout(r, RndTime+500))
                    this.bot.setControlState(direction, false);
                    this.log("Done moving", 0);
                    break;
                }
                else{
                    await this.breakSugarCane();
                    this.bot.setControlState(direction, true);
                }
                
                await new Promise(r => setTimeout(r, 100))
            }
        }
    }
    
    async walkInRows(rows, movement, coords, iteration){
        this.log("Total number of rows:" + rows + " Number of iteration:" + iteration, 1);
        for (let i=0; i<rows; i++){
            let RndTime = Math.floor(Math.random() * (1000 - 100 + 1)) + 100
            this.lastCoor1 = 0;
            this.lastCoor2 = 0;
            
            if ( i % 2 == 0){
                this.currentTask = `Walking row ${i+1} from ${rows}, Direction: ${movement[0]}, RndDelay: ${RndTime/1000}s`;
                this.log(`Walking row ${i+1} from ${rows}, Direction: ${movement[0]}, RndDelay: ${RndTime/1000}s`, 0);
                await this.walk(movement[0], coords, 1, RndTime);
            }
            else{
                this.currentTask = `Walking row ${i+1} from ${rows}, Direction: ${movement[1]}, RndDelay: ${RndTime/1000}s`;
                this.log(`Walking row ${i+1} from ${rows}, Direction: ${movement[1]}, RndDelay: ${RndTime/1000}s`, 0);
                await this.walk(movement[1], coords, 0, RndTime);                
            }
        }
    }    

    setupCoords(){
        for (let i=0; i<settings["CoordList"].length; i++){
            this.coordsCopy = [...settings["CoordList"][i]];

            this.coordsCopy[0] < 0 ? settings["CoordList"][i].push((this.coordsCopy[0])*-1) : this.coordsCopy[1] < 0 ? settings["CoordList"][i].push((this.coordsCopy[1])*-1) : settings["CoordList"][i].push(0);
    
            settings["CoordList"][i][2] = ((-180 + settings["CoordList"][i][2]*-1) * Math.PI) / 180;
        }
    }

    constructor(username, password, auth){
        this.username = username;
        this.password = password;
        this.auth = auth;
        this.host = botArgs["host"];
        this.port = botArgs["port"];
        this.version = botArgs["version"];

        this.botLocation = {
            "server": null,
            "gametype": null,
            "map": null
        };

        this.initBot();

        this.getLocation = getLocation;
        this.currentTask = null;
    }

    initBot(){  
        this.options =   {
            "username": this.username,
            "password": this.password,
            "auth": this.auth,
            "host": this.host,
            "port": this.port,
            "version": this.version,
            "hideErrors": true
        };
        this.bot = mineflayer.createBot(this.options);

        //inventoryViewer(this.bot);

        this.initEvents();
    }

    log(msg, level){
        if (level >= settings["DebugLevel"]){
            if ( level == 3){console.log(chalk.blue(msg)); };
            if ( level == 2){console.log(chalk.red(msg)); };
            if ( level == 1){console.log(chalk.yellow(msg)); };
            if ( level == 0){console.log(chalk.green(msg)); };
        }
    }
    
    initEvents(){ 

        this.bot.once('login', async () => {
            let botSocket = this.bot._client.socket;

            this.log(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`, 2);           
        });

        this.bot.on("end", async (reason) => {
            this.end = true;

            if (reason == "quit") {
                this.log("Disconnecting bot", 2);
                return;
            };

            this.log(`Disconnected for ${reason}`, 2);

            setTimeout(() => this.initBot(), 10000);
        });
        
        this.bot.on("spawn", async () => {
            this.log("Connected in", 0);

            await this.bot.waitForChunksToLoad();
            await new Promise(r => setTimeout(r, 1000));

            this.bot.chat("/locraw");

            await this.bot.waitForTicks(8);
        });

        this.bot.on("message", async (jsonMsg) => {
            if (jsonMsg["extra"] && jsonMsg["extra"].length === 100) { return }

            let rawText = jsonMsg.toString();

            if (rawText == "Woah there, slow down!") {
                await this.bot.waitForTicks(200);
                this.bot.chat("/lobby");
            }

            let [newBotLocation, validJSON] = this.getLocation(rawText);

            if (JSON.stringify(this.botLocation) != JSON.stringify(newBotLocation) && validJSON) {

                this.botLocation = newBotLocation;
                this.log(`Current location: {${this.botLocation["server"]}${this.botLocation["lobbyname"] ? `, ${this.botLocation["lobbyname"]}` : ""}${this.botLocation["gametype"] ? `, ${this.botLocation["gametype"]}` : ""}${this.botLocation["map"] ? `, ${this.botLocation["map"]}` : ""}}`, 1);

                await this.bot.waitForChunksToLoad();

                if (this.botLocation["server"] == "limbo") {
                    await this.bot.waitForTicks(10);
                    this.bot.chat("/lobby");
                    this.log("Warping to lobby", 2);
                    await this.bot.waitForTicks(5);
                }
                else if (this.botLocation["gametype"] == "MAIN"){
                    await this.bot.waitForTicks(10);
                    this.bot.chat("/skyblock");
                    this.log("Warping to skyblock", 2);
                    await this.bot.waitForTicks(5);
                }
                else if (this.botLocation["gametype"] == "PROTOTYPE"){
                    await this.bot.waitForTicks(10);
                    this.bot.chat("/lobby");
                    this.log("Warping to lobby", 2);
                    await this.bot.waitForTicks(5);
                }
                else if(this.botLocation["map"] == "Garden"){
                    this.log("Already in garden", 0);
                    this.bot.waitForTicks(5);

                    this.startMacro();
                }
                else if(this.botLocation["gametype"] == "SKYBLOCK"){
                    await this.bot.waitForTicks(10);
                    this.bot.chat("/warp garden");
                    this.bot.chat("/locraw");
                    this.log("Warping to garden", 2);
                    this.bot.waitForTicks(5);
                }
                else{
                    this.bot.chat("/locraw");
                    this.log("Ups...", 2);
                    this.bot.waitForTicks(5);
                }
            }
        });

        this.bot.on("error", async (err) => {
            if (err.code === "ECONNREFUSED" || err.code === "write ECONNRESET") {
                this.log(`Failed to connect to ${err.address}:${err.port}`, 2);
            }
            else{
                this.log(`Unhandled error: ${err}`, 2)
            }
        });

    }    

};

const ACCOUNT = JSON.parse(
    await readFile(
        new URL('./utils/ACCOUNTS.json', import.meta.url)
    )
);

let bots = [];

for (let i = 0; i < ACCOUNT.length; i++) {
    let ACC = ACCOUNT[i];
    console.log(chalk.grey(`Adding account ${ACC.ign}`));
    if (ACC.online == true){
        let newBot = new MCBot(ACC.email, ACC.password, ACC.auth);
        bots.push(newBot);
    }
    else{
        let newBot = new MCBot(ACC.ign, "", "");
        bots.push(newBot);
    }
};

/*{
        "ign": "TheDarkSinner",
        "email": "matyv@centrum.cz",
        "password": "8Zftd8t<=x~ARnT",
        "auth": "microsoft"
    }*/


rl.prompt(true);
rl.on("line", async (input) => {
    switch (input){
        case "get location":
            bots[0].log(`Current location: {${bots[0].botLocation["server"]}, ${bots[0].botLocation["gametype"]?bots[0].botLocation["gametype"]:""}, ${bots[0].botLocation["map"]?bots[0].botLocation["map"]:""}}`, 3);
            break;
        case "get task":
            bots[0].log(`Current task: ${bots[0].currentTask}`, 3);
            break;
        case "help":
            bots[0].log(`List of commands: "get location", "get task", "Warp 'pos'", "help", "end"`, 3);
            break;
        case "end":
            bots[0].log("Quitting", 3)
            process.exit();
        default:
            if (input.split(" ")[0] === "warp") {
                bots[0].log(`Warping ${input.split(" ")[1]}`, 3);
                bots[0].bot.chat(`/warp ${input.split(" ")[1]}`);
            }
            else{
                bots[0].log("Wrong command. To see the list of command write help", 3);
            }
            break;
    }
});
