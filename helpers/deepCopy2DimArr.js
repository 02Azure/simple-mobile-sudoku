export default function deepCopy2Dim(arr) {
  let deepCopy = []

  for(let n = 0; n < arr.length; n++) {
    let row = [...arr[n]] //deep copy the whole row
    deepCopy.push(row)
  }

  return deepCopy
}