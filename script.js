document.getElementById("enviar").addEventListener("click", async () => {
  const input = document.getElementById("pergunta").value;
  const chat = document.getElementById("chat");
  
  // Mostra a pergunta
  chat.innerHTML += `<p><strong>Você:</strong> ${input}</p>`;
  document.getElementById("pergunta").value = "";
  
  // Mostra "pensando"
  chat.innerHTML += `<p><em>IA está pensando...</em></p>`;

  // Faz requisição à API
  const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer SUA_CHAVE_AQUI"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }]
    })
  });

  const data = await resposta.json();
  const textoIA = data.choices[0].message.content;
  
  // Mostra resposta
  chat.innerHTML += `<p><strong>IA:</strong> ${textoIA}</p>`;
});
