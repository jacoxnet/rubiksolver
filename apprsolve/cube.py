import json

class OneFace:
    def __init__(self, cabezaID):
        self.cabezaID = cabezaID
        self.face = OneFace.calcFace(cabezaID)
        self.color = OneFace.calcColor(cabezaID)

    def calcFace(cabezaID):
        faces = ["U", "L", "F", "R", "B", "D"]
        return faces[int(cabezaID/9)]

    def calcColor(cabezaID):
        initialColors = ['yellow', 'blue', 'red', 'green', 'orange', 'white']
        return initialColors[int(cabezaID/9)]

    def __repr__(self):
        return (f"OneFace Object ID:{self.cabezaID} face:{self.face} color:{self.color}")
        

# Cubie's faces are a set of OneFace. Either two or three long (e.g. "FLU")
class Cubie:
    def __init__(self, cubieIDList):
        self.list = Cubie.getCubieId(cubieIDList)
        self.faces = cubieIDList
        self.name = Cubie.getCubieName(self)
        self.colors = Cubie.getColors(self)

    def getCubieId(cubieIDList):
        mylist = []
        for cubie in cubieIDList:
            mylist.append(OneFace(cubie))
        return mylist

    def getCubieName(self):
        n = ""
        for face in self.list:
            n = n + face.face
        return n

    def getColors(self):
        c = []
        for face in self.list:
            c.append(face.color)
        return c

    def __repr__(self):
        return (f"Cubie Object {self.name} {self.colors}")

# Cube is a list of Cubies. These connections are the associations between faces
# and cubies
class Cube:
    def __init__(self):
        self.cubieList = Cube.makeCube()
        self.exportCube = Cube.exportCube(self)
        
    def makeCube():
        connections = [[18, 11, 6], [19, 7], [20, 27, 8], [21, 14], [22], [23, 30], 
                    [24, 17, 45], [25, 46], [26, 33, 47], [13], [41, 12], 
                    [44, 15, 51], [10, 3], [16, 48], [38, 9, 0], [4], [37, 1], 
                    [28, 5], [36, 29, 2], [40], [39, 32], [43, 52], [42, 35, 53], 
                    [31], [34, 50], [49]]
        cube = []
        for mycubie in connections:
            cube.append(Cubie(mycubie))
        return cube

    def exportCube(self):
        exportDict = {}
        for cubie in self.cubieList:
            exportDict[cubie.name] = cubie.colors
        return exportDict

    def __repr__(self):
        return (json.dumps(self.exportCube))