const fs = require('fs'); // Module pour interagir avec le système de fichiers
const readline = require('readline'); // Module pour créer une interface de ligne de commande

const todoFile = 'test.txt'; // Nom du fichier de la liste de tâches

// Fonction pour lire la liste de tâches depuis le fichier
function readTodoList() {
    return new Promise((resolve, reject) => {
        fs.readFile(todoFile, 'utf8', (err, data) => { // Lecture asynchrone du fichier
            if (err) {
                if (err.code === 'ENOENT') {
                    // Si le fichier n'existe pas encore, retourne une liste vide
                    resolve([]);
                } else {
                    reject(err); // Rejette avec l'erreur rencontrée
                }
            } else {
                // Parse le contenu du fichier en tant que liste de tâches
                const tasks = data.trim().split('\n');
                resolve(tasks); // Résout avec la liste de tâches
            }
        });
    });
}

// Fonction pour écrire la liste de tâches dans le fichier
function writeTodoList(todoList) {
    return new Promise((resolve, reject) => {
        const tasksText = todoList.join('\n'); // Convertit la liste de tâches en texte
        fs.writeFile(todoFile, tasksText, 'utf8', err => { // Écriture asynchrone dans le fichier
            if (err) {
                reject(err); // Rejette avec l'erreur rencontrée
            } else {
                resolve(); // Résout une fois l'écriture terminée
            }
        });
    });
}

// Fonction pour afficher la liste de tâches
async function displayTodoList() {
    try {
        const todoList = await readTodoList(); // Lit la liste de tâches depuis le fichier
        console.log('--- Todo List ---');
        todoList.forEach((task, index) => {
            console.log(`${index + 1}. ${task}`); // Affiche chaque tâche avec son numéro
        });
        console.log('-----------------');
    } catch (err) {
        console.error('Erreur lors de la lecture de la liste de tâches :', err); // Gère les erreurs de lecture
    }
}

// Fonction pour ajouter une tâche à la liste
async function addTask(task) {
  try {
      const todoList = await readTodoList(); // Lit la liste de tâches depuis le fichier
      todoList.push(task); // Ajoute la nouvelle tâche à la liste
      await writeTodoList(todoList); // Écrit la nouvelle liste de tâches dans le fichier
      console.log(`La tâche "${task}" a été ajoutée à la liste.`);
      await displayTodoList(); // Affiche la liste mise à jour
  } catch (err) {
      console.error('Erreur lors de l\'ajout de la tâche :', err); // Gère les erreurs d'ajout
  }
}

// Fonction pour supprimer une tâche de la liste

// Interface utilisateur en ligne de commande
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Menu d'options
function displayMenu() {
  console.log('1. Afficher la liste de tâches');
  console.log('2. Ajouter une tâche');
  console.log('3. Quitter');
  rl.question('Choisissez une option : ', async (choice) => {
      switch (choice) {
          case '1':
              await displayTodoList(); // Affiche la liste de tâches
              displayMenu(); // Affiche à nouveau le menu après l'affichage
              break;
          case '2':
              rl.question('Entrez la tâche à ajouter : ', async (task) => {
                  await addTask(task); // Demande la tâche à ajouter et l'ajoute à la liste
                  displayMenu(); // Affiche à nouveau le menu après l'ajout
              });
              break;
          case '3':
              rl.close(); // Ferme l'interface de ligne de commande et termine le programme
              break;
          default:
              console.log('Option invalide.');
              displayMenu(); // Affiche à nouveau le menu en cas d'option invalide
              break;
      }
  });
}

// Démarrer le programme
console.log('Bienvenue dans votre Todo List !');
displayMenu(); // Affiche le menu principal au démarrage
