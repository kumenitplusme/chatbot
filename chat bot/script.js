const chatInput = document.querySelector(".chat-input textarea");
const sendchatbot = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY  = "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";
const inputInitHeight = chatInput.scrollHeight;


const createChatLi = (message, className) => {
   const chatLi = document.createElement("li");
   chatLi.classList.add("chat", className);
   let chatContent = className  === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">CB</span><p>${message}</p>`;
   chatLi.innerHTML = chatContent;
   return chatLi;
}

const generateResponse = (incomingChatLi) =>{
   const API_URL= "https://api.openai.com/v1/chat/completions";
   const messageElement = incomingChatLi.querySelector("p");

   const requestOptions = {
      method: "POST",
      headers:{
         "content-Type": "application/json",
         "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
         model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        role: "user",
        content: userMessage}]
      })
   }

   fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
      messageElement.textContent = data.choices[0].message.content;
      //console.log(data);
   }).catch((error) => {
      //console.log(error);
      messageElement.textContent = "Oops! Somthing went wrong. Please try again.";
   }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight)); 

}
 const handlechat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    chatInput.style.height = `${inputInitHeight}px`;

    setTimeout(() => {
      const incomingChatLi = createChatLi("Thinking...", "incoming")
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
      generateResponse(incomingChatLi);
    }, 600);
 }

 chatInput.addEventListener("input", () =>{
   chatInput.style.height = `${inputInitHeight}px`;
   chatInput.style.height = `${chatInput.scrollHeight}px`;
 });

 chatInput.addEventListener("keydown", (e) =>{
   if(e.key === "Enter" && !e.shiftkey  && window.innerWidth > 800){
      e.preventDefault();
      handlechat();
   }
 });

sendchatbot.addEventListener("click", handlechat);
 