# FONEAPI-CHAT3

----**OVERVIEW**----

This is a Realtime Chat Application that focuses on private(one to one) chatting between users. This project is made with NodeJs, MongoDB, and Socket.IO


----**HOW TO RUN THE APPLICATION**----

1. You can download the project, open your terminal and then cd into the project directory, then type ***npm install*** to install the packages. After installation
  is completed, type ***npm run devStart*** to start the server and go to ***http://localhost:3000/login*** on your browser

2. Since the project has been deployed using Render, you can also go to this url ***https://chat-applicationv2.onrender.com/login***


----**BASIC CHAT APPLICATION USAGE**----

When using the Chat Application, the first thing to do is register a **User**(Please do note that username and password are **case sensitive**). After logging
in, the user will be directed to **Dashboard**. The Dashboard consists of **2** sections: 
  * **Sidebar** - This section shows the contact list for the user, which when clicked, shows the conversation history for both users. It also includes a
                  button for adding contacts.
                  
  * **MesssageBox** - This section is where the actual messaging happens. It consists of a message input panel where users can send their messages, and a
                  message container that shows the messages that the user sent/recieved.




***Some Important Notes***

During messaging, it is highly recommended that a user ***must add each other first*** before they will be able to chat
