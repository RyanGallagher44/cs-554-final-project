# cs-554-final-project
This is the CS554 Final Project for Team Not Grad Students (Ryan Gallagher, Will Sassi, Jason Rossi, Jerry Cheng, Jack Schneiderhan)
Our project, called HeaReal, is a website that allows users to post about their favorite music, along with searching and liking for other music.

In order to ensure the app runs smoothly as intended, please follow the following instructions to set up the environment:

REDIS
1) To get redis up and running, use the following link: redis.io/docs/getting-started/ (Note: On Windows, you may need to install WSL, which you can learn more about at redis.io/docs/getting-started/installation/install-redis-on-windows/)
2) After downloading, start your Redis server (on Windows WSL, type sudo service redis-server start), or find out how to start your server on the link above.

ELASTIC SEARCH
1) Head to https://www.elastic.co/downloads/elasticsearch. Set your appropriate specs (e.g. Windows, Mac, etc.) and click download.
2) Once downloaded, open a command prompt (or something similar) and relocate yourself to the folder elasticsearch-8.5.3. 
    NOTE: You may need to download Kibana to ensure that the server starts correctly. Head here to find out where you can download Kibana: https://www.elastic.co/guide/en/kibana/current/install.html.  Once here, type bin/elasticsearch (bin\elasticsearch.bat on Windows) to get your server started. It should present to you a large body of text with these two important lines:
    The generated password for the elastic built-in superuser is (password)
    The enrollment token for Kibana instances, valid for the next 30 minutes: (enrollment-token)
    Using the enrollment token above, once Kibana is installed, head to the localhost:9200 and enter your enrollment token to ensure
    that the elastic server is up and running.
3) From above, find the line that give you your generated password for the elastic super user. Within this final project folder,
head to cs-544-final-project/backend/routes/config.js. On line 6, where there is a password variable, enter your password from the elastic server as a string. This should ensure elastic search is up and running correctly.

GRAPHICS MAGICK
1) Follow the instructions to install ImageMagick for your OS here: https://imagemagick.org/script/download.php
2) To download graphics magick, head here: https://sourceforge.net/projects/graphicsmagick/files/. The code having to do with graphics magick was coded on a Windows machine. 

To download on Windows, click on graphicsmagick-binaries and click on 1.3.35. PLEASE NOTE WE DID NOT USE THE MOST RECENT BUILD AS IT WAS CAUSING ISSUES, SO PLEASE USE 1.3.35.

    - Download one of the installers from the list and run the installer on your machine. 

For Mac and other users, click on graphicsmagick folder and click on 1.3.35. PLEASE NOTE WE DID NOT USE THE MOST RECENT BUILD AS IT WAS CAUSING ISSUES, SO PLEASE USE 1.3.35.

    - Download GraphicsMagick-1.3.35.tar.gz
    - Once unzipped, navigate into the folder and run ./configure
    - type 'make'
    - type 'sudo make install' (will ask for password)

***in /backend/routes/images.js, please comment/uncomment the gm requirement based on your OS

4) We found that restarting your machine after installing graphics magick proved to be the best option for ensuring it was installed correctly. To test that its working, if you type 'gm' into a command line, there should be information about graphicsmagick printed back.

ENV FILE
1) There should be an env file either on github or submitted separately on canvas. Please ensure the env file stays in the cs-544-final-project/client/ file directory.

NODE MODULES
1) As always, when the app has been downloaded, type npm install in both the backend and client directories to make sure the proper npm modules have been installed.

MATERIALUI
1) We used MaterialUI throughout our entire project and a lot of tota11y and HTML errors are being caused by this.
