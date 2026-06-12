const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCharacters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20; 
    const skip = (page - 1) * limit;
    const cacheKey = `characters:page:${page}`;

    // Try fetching from redis
    if (global.isRedisReady) {
      const cachedData = await global.redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json({
          source: 'cache',
          page,
          data: JSON.parse(cachedData)
        });
      }
    }

    // Fallback to postgres
    const characters = await prisma.character.findMany({
      skip: skip,
      take: limit,
      orderBy: { id: 'asc' }
    });

    // Save data to redis for 1 hour 
    if (global.isRedisReady && characters.length > 0) {
      await global.redisClient.setEx(cacheKey, 3600, JSON.stringify(characters));
    }

    res.status(200).json({
      source: 'database',
      page,
      data: characters
    });
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCharacterById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const character = await prisma.character.findUnique({ where: { id } });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.status(200).json(character);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.searchCharactersByName = async (req, res) => {
  try {
    const { name } = req.query; 

    if (!name) {
      return res.status(400).json({ error: 'Please provide a name to search for.' });
    }

    const characters = await prisma.character.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',  
        },
      },
      take: 20, 
    });

    if (characters.length === 0) {
      return res.status(404).json({ message: 'No characters found matching that name.' });
    }

    res.status(200).json(characters);
  } catch (error) {
    console.error('Error searching characters by name:', error);
    res.status(500).json({ error: 'Internal server error during search' });
  }
};

exports.createCharacter = async (req, res) => {
  try {
    const newCharacter = await prisma.character.create({
      data: req.body
    });

    // Invalidate cache safely using the global instance
    if (global.isRedisReady) await global.redisClient.flushDb(); 

    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create character' });
  }
};

exports.updateCharacter = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: req.body
    });

    if (global.isRedisReady) await global.redisClient.flushDb();

    res.status(200).json(updatedCharacter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update character' });
  }
};

exports.destroyCharacter = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.character.delete({ where: { id } });

    if (global.isRedisReady) await global.redisClient.flushDb();

    res.status(200).json({ message: 'Character destroyed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete character' });
  }
};