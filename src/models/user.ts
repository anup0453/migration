import { compareSync, hashSync } from 'bcryptjs'
import mongoose, { Schema } from 'mongoose'

import { randomString } from '../utils'
import { UserDocument, UserModel, UserSchema as UserSchemaType } from './types'

const UserSchema: UserSchemaType = new Schema(
  {
    apiKey: String,
    departments: [String],
    email: { required: true, type: String },
    firstname: String,
    isActive: Boolean,
    lastname: String,
    role: String,
  },
  {
    collection: 'user',
    timestamps: true,
  },
)

UserSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

UserSchema.pre(
  'save',
  async function (this: UserDocument, next: CallableFunction) {
    if (this.isNew && !this.apiKey) {
      this.apiKey = randomString(36)
    }

    if (!this.isModified('apiKey')) {
      return next()
    }

    this.apiKey = hashSync(this.apiKey)
  },
)

UserSchema.methods.verifyApiKey = async function (
  key: string,
): Promise<boolean> {
  const userWithApiKey = await mongoose
    .model<UserDocument, UserModel>('User')
    .findById(this._id)
    .select('apiKey')
    .exec()

  return compareSync(key, userWithApiKey.apiKey)
}

export type UserProps = Partial<UserDocument>

export const User: UserModel = mongoose.model<UserDocument, UserModel>(
  'User',
  UserSchema,
  'user',
)
