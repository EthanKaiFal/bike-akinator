import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'bikeAkinDrive',
  isDefault: true,
  access: (allow) => ({
    'csvfiles/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'picture-submissions/*': [
      allow.authenticated.to(['read','write']),
      allow.guest.to(['read', 'write'])
    ],
  })
});