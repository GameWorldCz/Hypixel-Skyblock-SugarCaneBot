export function getLocation(rawText){

    let validJson = false;
    let botLocation = {
        "server": null,
        "gametype": null,
        "map": null
    };

    if (rawText[0] === "{"){
        try{
            let jsonData = JSON.parse(rawText);

            if (jsonData["server"]){ botLocation["server"] = jsonData["server"]; validJson = true; }
            else { throw "Error: not /locraw"; }

            if (jsonData["gametype"]) { botLocation["gametype"] = jsonData["gametype"]; }
            else { botLocation["gametype"] = null; }

            if (jsonData["map"]) { botLocation["map"] = jsonData["map"]; }
            else { botLocation["map"] = null; }
        }
        catch (Exception){
            if (Exception === "Error: not /locraw"){

            }
            else{
                console.log("Unhandled Exception = ${Exception}");
            }
        }
    }

    return [botLocation, validJson];

}