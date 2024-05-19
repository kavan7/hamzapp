import { HawkhacksApi } from 'neurelo-sdk';

async function getAllFlashcards() {
    try {
        const client = new HawkhacksApi();
        const res = await client.findHawkhacks();
        console.log(res.data);
    } catch (error) {
        console.error('Error retrieving flashcards:', error);
    }
}

getAllFlashcards();