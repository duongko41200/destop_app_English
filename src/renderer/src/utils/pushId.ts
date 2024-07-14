export const pushId = (data: any[]) => {
  const resData = data.map((value: any, idx: number) => {
    value.id = idx + 1
    return value
  })

  return resData
}
