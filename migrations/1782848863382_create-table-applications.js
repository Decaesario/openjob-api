export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('applications', {
        id: { type: 'VARCHAR(50)', primaryKey: true },
        job_id: { type: 'VARCHAR(50)', notNull: true },
        user_id: { type: 'VARCHAR(50)', notNull: true },
        cover_letter: { type: 'TEXT' },
        status: { type: 'VARCHAR(20)', notNull: true, default: 'pending' },
        created_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
        updated_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
    });

    pgm.addConstraint('applications', 'fk_applications_job', 'FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE');
    pgm.addConstraint('applications', 'fk_applications_user', 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('applications', 'unique_application', 'UNIQUE(job_id, user_id)');
};

export const down = (pgm) => {
    pgm.dropTable('applications');
};