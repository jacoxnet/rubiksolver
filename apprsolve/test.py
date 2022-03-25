T = [0, 1, 2, 3, 4, 5, 6, 7, 8]
L = [9, 10, 11, 12, 13, 14, 15, 16, 17]
F = [18, 19, 20, 21, 22, 23, 24, 25, 26]
R = [27, 28, 29, 30, 31, 32, 33, 34, 35]
B = [36, 37, 38, 39, 40, 41, 42, 43, 44]
D = [45, 46, 47, 48, 49, 50, 51, 52, 53]



ppcube = {'FLU': [18, 11, 6],
          'FU':  [19, 7],
          'FUR': [20, 27, 8],
          'FL':  [21, 14],
          'F':   [22],
          'FR':  [23, 30],
          'FLD': [24, 17, 45],
          'FD':  [25, 46],
          'FRD': [26, 33, 47],      
          'L':   [13],
          'LB': [16, 41],
          'LBD': [15, 44, 51],
          'LU': [10, 3],
          'LD': [16, 48],
          'LUB': [9, 0, 38],
          'U':  [4],
          'UB': [1, 37],
          'UR': [5, 28],
          'UBR': [2, 29, 36],
          'B':  [40],
          'BR': [39, 32],
          'BD': [43, 52],
          'BRD': [42, 35, 53],
          'R':  [31],
          'RD': [34, 50],
          'D':  [49]
}

cubecode = {'w': 'white', 'o': 'orange', 'r': 'red', 'g': 'green', 'y':'yellow', 'b': 'blue'}

def translate_cube(cabezas):
    translation = {}
    if len(cabezas) != 54:
        print('must be 54 chars')
        return
    for item, values in ppcube.items():
        translation[item] = []
        print('item', item)
        for v in values:
            print ('value', v)
            translation[item].append(cubecode[cabezas[v]])
    return translation
