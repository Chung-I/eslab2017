# BLE programming using node.js and python

## Steps
1. connect ADXL345 and RPi using wires
2. type `npm i` to install required modules
3. 
```
(peripheral)$ sudo hciconfig hci0 up
(peripheral)$ sudo hciconfig hci0 leadv 0
``` 
4. check if the central can find the peripheral by typing the command below:
```
(central)$ sudo hcitool lescan
```    

## Usage

    (peripheral)$ sudo node main.js
    
    (central)$ sudo python gatt.py [peripheral address]

