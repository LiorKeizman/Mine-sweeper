
// var mat = createMat(4)
// console.log(mat);
function createMat(size){
    var mat=[]
    for(var i = 0 ; i<size;i++){
        mat[i]=[]
        for(var j =0;j<size;j++){
            mat[i][j]=''
        }
    }
return mat
}


// '💣'


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}