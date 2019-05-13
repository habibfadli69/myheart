class response:
    def __init__(self):
        self.__status = True
        self.__message = ""
        self.__data = {}
    
    def setStatus(self,status):
        self.__status = status

    def setMessage(self,msg):
        self.__message = msg

    def setData(self, data):
        self.__data = data

    def getResponse(self):
        respon = {
            'status' : self.__status,
            'message' : self.__message,
            'data' : self.__data
        }
        return respon
    




