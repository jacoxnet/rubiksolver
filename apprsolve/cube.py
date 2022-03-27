import json

colorList = ['yellow', 'blue', 'red', 'green', 'orange', 'white']
faceList = ["U", "L", "F", "R", "B", "D"]
connections = [[18, 11, 6], [19, 7], [20, 27, 8], [21, 14], [22], [23, 30], 
                [24, 17, 45], [25, 46], [26, 33, 47], [13], [41, 12], 
                [44, 15, 51], [10, 3], [16, 48], [38, 9, 0], [4], [37, 1], 
                [28, 5], [36, 29, 2], [40], [39, 32], [43, 52], [42, 35, 53], 
                [31], [34, 50], [49]]

class OneFace:
    def __init__(self, cabezaID):
        self.cabezaID = cabezaID
        self.face = faceList[int(self.cabezaID/9)]
        self.color = colorList[int(self.cabezaID/9)]

    def __repr__(self):
        return (f"OneFace Object ID:{self.cabezaID} face:{self.face} color:{self.color}")
        

# Cubie's faces are a list of OneFace. Either two or three long (e.g. "FLU")
class Cubie:
    def __init__(self, cabezaIDList):
        self.cabezas = cabezaIDList
        self.faces = [OneFace(cabeza) for cabeza in cabezaIDList]
        self.name = Cubie.getname(self)
        self.colors = Cubie.getcolors(self)
        
    # return name e.g. FLU (convert to string first)
    def getname(self):
        return "".join([f.face for f in self.faces])
    
    # get cabeza ids for each face of cubie
    def getcabezas(self):
        return [f.cabezaID for f in self.faces]
    
    # retrieve list of colors of this cubie in order
    def getcolors(self):
        return [f.color for f in self.faces]

    # set list of colors of this cube in order
    def setcolors(self, colorlist):
        for i in range (len(self.faces)):
            self.faces[i].color = colorlist[i]
    
    def __repr__(self):
        return(f"Cubie object:{self.name} {self.colors}")

# Cube is a list of Cubies. These connections are the associations between faces
# and cubies
class Cube:
    
    def __init__(self):
        self.cubieList = []
        for mycubie in connections:
            self.cubieList.append(Cubie(mycubie))

    def exportCube(self):
        exportDict = {}
        for cubie in self.cubieList:
            exportDict[cubie.name] = cubie.getcolors()
        return exportDict

    def importCube(self, spec):
        for cubie in self.cubieList:
            cubie.setcolors(spec[cubie.name])
        return self

    def getCabezaNotation(self):
        returnVal = [' '] * 54
        for cubie in self.cubieList:
            for f in cubie.faces:
                returnVal[f.cabezaID] = f.color[0]
        return returnVal

    def putCabezaNotation(self, cabezasSpec):
        
        def colorConvert(c):
            for color in colorList:
                if color[0] == c:
                    return color
            return None

        for cubie in self.cubieList:
            for face in cubie.faces:
                face.color = colorConvert(cabezasSpec[face.cabezaID])


    def __repr__(self):
        return ("Cube object: " + json.dumps(self.exportCube()))