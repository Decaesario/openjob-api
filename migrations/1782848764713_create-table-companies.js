export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('companies', {
        id: { type: 'VARCHAR(50)', primaryKey: true },
        name: { type: 'VARCHAR(100)', notNull: true },
        description: { type: 'TEXT' },
        location: { type: 'VARCHAR(255)' },
        industry: { type: 'VARCHAR(100)' },
        website: { type: 'VARCHAR(255)' },
        owner_id: { type: 'VARCHAR(50)', notNull: true },
        created_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
        updated_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
    });

    pgm.addConstraint('companies', 'fk_companies_owner', 'FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE');
};

export const down = (pgm) => {
    pgm.dropTable('companies');
};