import SequelizeInstance from './SequelizeInstance';

export async function confirmDBConnection() {
  try {
    await SequelizeInstance.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw new Error('Failed to connect to the database');
  }
}
