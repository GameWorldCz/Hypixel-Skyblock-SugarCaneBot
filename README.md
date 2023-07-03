# Skyblock-SugarCaneBot
*A node.js minecraft bot to automatically mine sugar canes in garden.*

## Features
* Auto sugar cane mining
* Running in headless mode
* Risk free

## Guide
1/ Build a simple sugar cane farm in garden as picture shows. Make sure build the rows from East to West. (in picture "map1" im using plot2)

<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/99589691/250658086-ddf28ab6-c5f7-406b-afdd-4c0989be3274.png" alt="map1" width="1000">

2/ Use "/setspawn" at start and rotate you camera to exactly -135°. (You can use f3 to check) (There are other variations depending from where you are going [45, -45, 135, -135], but if you follow me you don't have to worry about errors)

<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/99589691/250656843-50bbdcf7-f830-4521-9ba6-1236434a1ba0.png" alt="map2" width="1000">

3/ Install Node.js >= 14 from [nodejs.org](https://nodejs.org/)

4/ Install Python >= 3.9 from [python.org](https://www.python.org/downloads/)

5/ Open cmd and paste this command without quotes: "npm install --global chalk mineflayer mjs"

6/ Install all files from this repository

7/ Open "utils" folder, open ACCOUNTS and change IGN, email and password to login credentials of the account you want the bot to use (make sure not to delete the quotes, ex: "email": "email@gmail.com").

8/ In "utils" folder, open settings and change these settings: 
* in "CoordList" coor1 and coor2 to A and B in the picture (for me at plot2 it was -46 and 46), angle to the angle you set your camera previously, I used -135°;
* in "rows" change rows to the number of rows you have in you plot (i have 31); 
* in "movement" change "back", or "left" depending which way you should be moving first ("back"="S", "left"="A", "right"="D", "forward"="W")

9/ Double click "AutoStart.py" and enjoy! (if a bug or error occurs, you can try to fix it yourself or pull a request)


*Note: in settings folder you can change "DebugLevel" to 0, 1, 2 (0=debug, 1=info, 2=errors)*
