#!/usr/bin/python
#from __future__ import print_function
import smbus
import time
import RPi.GPIO as GPIO

bus = smbus.SMBus(1)
address = 0x04
GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

def writeNumber(value):
    bus.write_byte(address, value)
    return -1

def readNumber(channel):
    number = bus.read_byte(address)
    print("Arduino: Hey RPI, I received a digit ", number)
    return -1

GPIO.add_event_detect(17, GPIO.BOTH, callback=readNumber, bouncetime=200)
while True:
    var = int(input("Enter 1-255:"))
    if not var:
        print("1")
        continue
    writeNumber(var)
    print("RPI: Hi Arduino, I sent you ", var)
    time.sleep(0.1)
