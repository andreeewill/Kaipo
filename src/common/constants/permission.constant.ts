export const PERMISSION = {
  // owner (owner by default will have all the permissions below)
  REGISTER_USER: 'create:users',

  // doctor
  UPDATE_APPOINTMENTS: 'update:appointments',

  // admin
  CREATE_APPOINTMENT: 'create:appointments',
} as const;
