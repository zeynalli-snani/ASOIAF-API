const fs = require('fs');
const path = require('path');

async function fetchAllBookData() {
  let allCharacters = [];
  let page = 1;
  const pageSize = 50; 
  
  console.log("Commencing full data fetch from An API of Ice and Fire...");

  while (true) {
    try {
      const res = await fetch(`https://anapioficeandfire.com/api/characters?page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      
      if (data.length === 0) {
          console.log("No more characters found. Fetch complete.");
          break;
      }
      
      const cleanedData = data.map(char => ({
        name: char.name || char.aliases[0] || "Unknown",
        gender: char.gender || "Unknown",
        culture: char.culture || "Unknown",
        born: char.born || "Unknown",
        died: char.died || "", 
        titles: char.titles.filter(t => t !== ""),
        aliases: char.aliases.filter(a => a !== "")
      }));

      allCharacters.push(...cleanedData);
      console.log(`Retrieved page ${page}... (Current total: ${allCharacters.length})`);
      page++;
    } catch (error) {
      console.error("Error fetching data:", error);
      break;
    }
  }

  const filePath = path.join(__dirname, 'asoiaf_data.json');
  fs.writeFileSync(filePath, JSON.stringify(allCharacters, null, 2));
  
  console.log(`Success! ${allCharacters.length} total book characters saved to ${filePath}`);
}

fetchAllBookData();