// Nomi maschili
const maleNames = [
  "James", "William", "Oliver", "Benjamin", "Henry",
  "Alexander", "Charles", "Thomas", "George", "Samuel"
];

// Nomi femminili
const femaleNames = [
  "Olivia", "Emma", "Charlotte", "Amelia", "Sophia",
  "Isabella", "Ava", "Emily", "Grace", "Lily"
];

// Cognomi
const surnames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones",
  "Miller", "Davis", "Wilson", "Anderson", "Taylor"
];


function getRandomName(gender = "any") {
  const firstNameList = gender === "male" ? maleNames
                      : gender === "female" ? femaleNames
                      : maleNames.concat(femaleNames);

  const firstName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  
  return `${firstName} ${surname}`;
}

function getDateYearsAgo(yago=0) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - yago);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// console.log(getRandomName("male"));   // E.g., "Thomas Brown"
// console.log(getRandomName("female")); // E.g., "Emma Davis"
// console.log(getRandomName());         // E.g., "Lily Jones"

module.exports = {getRandomName, getDateYearsAgo}