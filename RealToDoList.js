const fs = require('fs'); // Module pour interagir avec le système de fichiers
const readline = require('readline'); // Module pour créer une interface de ligne de commande

const jsondata = require('./TDL.json');
const { json } = require('stream/consumers');

// Interface utilisateur en ligne de commande
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

// Menu d'options
function displayMenu() {
    console.log('1. Afficher la liste de tâches');
    console.log('2. Ajouter une tâche');
    console.log('3. Modifier une tâche');
    console.log('4. Quitter');
    rl.question('Choisissez une option : ', (choice) => {
        switch (choice) {
            case '1':
                console.log('Voici votre liste : ')
                console.log(jsondata);
                displayMenu();
                break;
            case '2':
                rl.question('Entrez la tâche à ajouter : ', (task) => {
                    if (stringIsNullOrWhiteSpace(task)){
                        console.log('La tâche ne peut pas être vide');
                        displayMenu();
                        return;
                    }
                    const ids = jsondata.map(task => task.id);
                    const todo = {
                        id: Math.max(0, ...ids) + 1,
                        name : task,
                        isDone: false
                    };
                    jsondata.push(todo)
                    fs.writeFileSync("TDL.json", JSON.stringify(jsondata))
                    console.log(jsondata)
                    console.log('La tâche a été ajoutée !')
                    displayMenu()
                });
                break;
            case '3':
                rl.question('Quelle tâche voulez vous modifier ? ', (taskid) => {
                    const task = jsondata.find(task => task.id == taskid);
                    if (task == undefined){
                        console.log('La tâche n\'existe pas');
                        displayMenu();
                        return;
                    }
                    console.log(task)
                    console.log('1. Changer le nom')
                    console.log('2. Cloturer la tâche')
                    console.log('3. Supprimer la tâche')
                    console.log('4. Retour')

                    rl.question('Que voulez vous faire ? ', answer => {
                        switch (answer) {
                            case '1' :
                                rl.question('Entrer son nouveau nom : ', newName =>{
                                    task.name = newName;
                                    fs.writeFileSync("TDL.json", JSON.stringify(jsondata));
                                    console.log(jsondata);
                                    console.log('La tâche a changé de nom !');
                                    displayMenu();
                                })
                                break;
                            case '2' :
                                task.isDone = true;
                                fs.writeFileSync("TDL.json", JSON.stringify(jsondata));
                                console.log(jsondata);
                                console.log('La tâche est terminée !');
                                displayMenu();
                                break;
                            case '3' :
                                const index = jsondata.indexOf(task);
                                jsondata.splice(index, 1);
                                fs.writeFileSync("TDL.json", JSON.stringify(jsondata));
                                console.log(jsondata);
                                console.log('La tâche est supprimée !');
                                displayMenu();
                                break;
                            case '4' :
                                displayMenu();
                            default :
                                break;
                        }
                    })
                });
                break;
            case '4':
                rl.close(); // Ferme l'interface de ligne de commande et termine le programme
                break;
            default:
                console.log('Option invalide.');
                displayMenu(); // Affiche à nouveau le menu en cas d'option invalide
                break;
        }
    });
};

function stringIsNullOrWhiteSpace(str) {
    return !str || !str.trim();
}

displayMenu()