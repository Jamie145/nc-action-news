function LookUp(array, key1, ky2){
    const referenceObject = {}

    array.foreach(object =>{
        referenceObject[object.key1] = object.key2})
        //object[key1] is getting the value of the property and adding it to our object as a key and giving it the value of the next property we reference key