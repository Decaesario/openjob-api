export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('documents', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true },
    name: { type: 'VARCHAR(255)', notNull: true },
    filename: { type: 'VARCHAR(255)', notNull: true },
    url: { type: 'TEXT', notNull: true },
    size: { type: 'INTEGER', notNull: true },
    created_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
  });

  pgm.addConstraint('documents', 'fk_documents_user', 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
};

export const down = (pgm) => {
  pgm.dropTable('documents');
};