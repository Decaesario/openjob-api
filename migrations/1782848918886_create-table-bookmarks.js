export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('bookmarks', {
        id: { type: 'VARCHAR(50)', primaryKey: true },
        job_id: { type: 'VARCHAR(50)', notNull: true },
        user_id: { type: 'VARCHAR(50)', notNull: true },
        created_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
    });

    pgm.addConstraint('bookmarks', 'fk_bookmarks_job', 'FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE');
    pgm.addConstraint('bookmarks', 'fk_bookmarks_user', 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('bookmarks', 'unique_bookmark', 'UNIQUE(job_id, user_id)');
};

export const down = (pgm) => {
    pgm.dropTable('bookmarks');
};