# ⚽ Penalty Showdown

**Penalty Showdown** é um jogo interativo de disputa de pênaltis para **2 jogadores**, desenvolvido para a exposição do **Mundo SENAI**.

O projeto combina programação, lógica de jogos, inteligência artificial e uma interface visual inspirada em transmissões esportivas para proporcionar uma experiência competitiva e interativa.

---

## 🎮 Sobre o jogo

Dois jogadores disputam uma série de cobranças de pênaltis.

Cada jogador realiza **5 cobranças** e, ao final, o placar é comparado. Caso a partida termine empatada, o jogo entra em **morte súbita**, garantindo que sempre exista um único vencedor.

Antes do início da partida, os jogadores podem informar seus nomes e configurar diferentes opções do jogo.

Durante cada cobrança, o jogador precisa escolher a **direção** e controlar a **força do chute** para tentar superar o goleiro.

---

## ✨ Funcionalidades

* 👥 Disputa entre 2 jogadores
* ⚽ 5 cobranças para cada jogador
* 🏆 Sistema de vencedor único
* 🔥 Morte súbita em caso de empate
* 🎯 Sistema de mira com 9 zonas do gol
* 💪 Barra de força dinâmica
* 🧤 Goleiro controlado por IA
* 🎚️ Diferentes níveis de dificuldade
* 🏟️ Escolha de estádio
* 🎨 Escolha de cores
* 📊 Placar inspirado em transmissões esportivas
* 📜 Histórico de partidas
* 💾 Salvamento utilizando `localStorage`
* 🔊 Efeitos sonoros com Web Audio API
* 🖱️ Suporte a mouse e touch
* ⌨️ Controles por teclado
* 📱 Interface responsiva
* 🌐 Funcionamento offline
* 🚫 Sem frameworks externos

---

## 🎯 Controles

### 🖱️ Mouse / Touch

* Clique nas zonas do gol para escolher a direção
* Arraste a mira para ajustar o chute
* Clique em **CHUTAR** para realizar a cobrança

### ⌨️ Teclado

* **Setas:** movimentar a mira
* **Espaço / Enter:** realizar o chute

---

## 🧠 Inteligência Artificial

O goleiro possui um sistema de IA que determina suas ações de defesa de acordo com o nível de dificuldade selecionado.

A dificuldade influencia o comportamento do goleiro, tornando as cobranças mais desafiadoras e proporcionando diferentes níveis de desafio ao jogador.

---

## 🏟️ Experiência do jogo

O Penalty Showdown foi projetado pensando em uma experiência de exposição, com uma interface visual chamativa e controles simples para que os visitantes possam entender e jogar rapidamente.

O sistema foi desenvolvido para funcionar tanto em **computadores quanto em dispositivos com tela sensível ao toque**.

---

## 🏗️ Estrutura do projeto

```text
penalty-showdown/
│
├── index.html
│
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│   ├── game.js
│   ├── player.js
│   ├── goalkeeper.js
│   ├── ball.js
│   ├── ui.js
│   ├── audio.js
│   └── storage.js
│
├── LICENSE
└── README.md
```

---

## 🛠️ Tecnologias utilizadas

### Front-end

* **HTML5**
* **CSS3**
* **JavaScript ES6+**

### Recursos utilizados

* CSS Animations
* CSS Gradients
* CSS `backdrop-filter`
* JavaScript Modules
* DOM API
* Web Audio API
* `localStorage`

O projeto foi desenvolvido sem frameworks externos.

---

## ▶️ Como executar

### Opção 1 — Abrir diretamente

Abra o arquivo:

```text
index.html
```

em um navegador moderno.

### Opção 2 — Live Server

No Visual Studio Code, utilize a extensão **Live Server** e abra o projeto pelo navegador.

### Opção 3 — Python

Com o Python instalado, execute dentro da pasta do projeto:

```bash
python -m http.server 8080
```

Depois acesse:

```text
http://localhost:8080
```

---

## 🎓 Objetivo

O **Penalty Showdown** foi desenvolvido para a **exposição do Mundo SENAI**, com o objetivo de demonstrar na prática conhecimentos de desenvolvimento de software e criação de aplicações interativas.

O projeto envolve conceitos como:

* Lógica de programação
* Desenvolvimento Web
* JavaScript
* Programação modular
* Inteligência Artificial
* Desenvolvimento de jogos
* Manipulação do DOM
* Animações
* Áudio digital
* Armazenamento local
* Design responsivo
* Experiência do usuário

---

## 🚀 Possíveis melhorias futuras

Algumas funcionalidades que podem ser adicionadas em futuras versões:

* 🌐 Multiplayer online
* 🏆 Sistema de ranking
* 🥇 Modo torneio
* 📈 Estatísticas detalhadas
* 🏟️ Novos estádios
* 🧤 Novos goleiros
* ⚽ Novos tipos de chute
* 🎙️ Narração das partidas
* 🎵 Trilha sonora
* 💻 Sistema de partidas online
* 🗄️ Integração com banco de dados

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.

Isso permite que outras pessoas utilizem, estudem, modifiquem e distribuam o projeto, desde que mantenham o aviso de copyright e a licença original.

Consulte o arquivo [`LICENSE`](LICENSE) para mais informações.

---

## 👨‍💻 Projeto

**Penalty Showdown**

Desenvolvido para exposição no **Mundo SENAI**.

**Tecnologias:** HTML5 · CSS3 · JavaScript

---

⭐ Se você gostou do projeto, considere deixar uma estrela no repositório!
