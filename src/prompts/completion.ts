import { RoleEnum } from '../constants'

export const summarizeConversationPrompt = (
  msg: string,
  isChatCompletion = true,
) => {
  const content = `<conversation>\n${msg}\n</conversation>`

  return isChatCompletion
    ? {
      role: RoleEnum.user,
      content,
    }
    : content
}

export const generateSearchQueryPrompt = (
  msg: string,
  isChatCompletion = true,
) => {
  const content = `<conversation>\n${msg}\n</conversation>`

  return isChatCompletion
    ? {
      role: RoleEnum.user,
      content,
    }
    : content
}

export const reactOnUserMessagePrompt = (
  userPrompt: string,
  sources: string,
) => {
  const prompt = `
  <UserPrompt>
  ${userPrompt}
  </UserPrompt>\n
  
  <Sources>
  ${sources}
  </Sources>\n
  `

  return prompt
}
