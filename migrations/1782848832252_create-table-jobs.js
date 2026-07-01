export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('jobs', {
        id: { type: 'VARCHAR(50)', primaryKey: true },
        title: { type: 'VARCHAR(255)', notNull: true },
        description: { type: 'TEXT', notNull: true },
        requirements: { type: 'TEXT' },
        salary_min: { type: 'INTEGER' },
        salary_max: { type: 'INTEGER' },
        is_salary_visible: { type: 'BOOLEAN', default: true },
        job_type: { type: 'VARCHAR(50)' },
        experience_level: { type: 'VARCHAR(50)' },
        location_type: { type: 'VARCHAR(50)' },
        location_city: { type: 'VARCHAR(255)' },
        status: { type: 'VARCHAR(20)', notNull: true, default: 'open' },
        company_id: { type: 'VARCHAR(50)', notNull: true },
        category_id: { type: 'VARCHAR(50)', notNull: true },
        owner_id: { type: 'VARCHAR(50)', notNull: true },
        created_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
        updated_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
    });

    pgm.addConstraint('jobs', 'fk_jobs_company', 'FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE');
    pgm.addConstraint('jobs', 'fk_jobs_category', 'FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE');
    pgm.addConstraint('jobs', 'fk_jobs_owner', 'FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE');
};

export const down = (pgm) => {
    pgm.dropTable('jobs');
};