TARGET=adxl345
OBJECT=adxl345.o
CC=gcc
CXX=g++
LD=g++
LD_FLAGS += -lwiringPi
C_FLAGS= -Wall -g
ALL : $(TARGET)
$(TARGET) : $(OBJECT)
	$(LD) $^ $(LD_FLAGS) -o $@
#%.o : %.c 
#	$(CC) $(C_FLAGS) -c $<
#%.o : %.c
#	$(CC) $(C_FLAGS) $< -o $@
%.o : %.cpp
	$(CXX) $(C_FLAGS) -c $<
.PHONY: clean
clean :
	-rm -f $(TARGET) $(OBJECT) 
