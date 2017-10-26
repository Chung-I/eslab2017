from gattlib import GATTRequester, GATTResponse
import sys

address =  sys.argv[1]
requester = GATTRequester(address)

data = requester.read_by_handle(0x000c)
print(data[0])


