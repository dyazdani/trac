const compareArrays = (arrayOne: string[], arrayTwo: string[]) => 
    arrayOne.length === arrayTwo.length &&
    arrayOne.every((element, index) => element === arrayTwo[index])

export default compareArrays;