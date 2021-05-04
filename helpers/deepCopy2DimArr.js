export default function deepCopy(arr) {
  let deepCopy = []

  for(let n = 0; n < arr.length; n++) {
    let row = [...arr[n]]
    deepCopy.push(row)
  }

  return deepCopy
}