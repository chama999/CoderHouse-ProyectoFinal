import normalizr from 'normalizr';

//schemas author y message normalizr
const { schema } = normalizr;
const userSchemaNormalizr = new schema.Entity('users', {}, { idAttribute: 'email' });
const messageSchemaNormalizr = new schema.Entity('messages', {user: userSchemaNormalizr})

export {
    userSchemaNormalizr,
    messageSchemaNormalizr
}