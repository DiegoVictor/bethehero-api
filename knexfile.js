module.exports = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/files/test.sqlite',
    },
    migrations: {
      directory: './src/database/migrations',
    },
    useNullAsDefault: true,
  },

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/files/db.sqlite',
    },
    migrations: {
      directory: './src/database/migrations',
    },
    useNullAsDefault: true,
  },
};
