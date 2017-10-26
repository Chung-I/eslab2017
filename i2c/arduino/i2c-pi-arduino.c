#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <linux/i2c-dev.h>
#include <sys/ioctl.h>
#include <fcntl.h>
#include <unistd.h>
#include <wiringPi.h>
// The arduino board i2c address (slave)
#define ADDRESS 0x04
// The I2C bus: This is for V2 pi's. For V1 Model B you need i2c-0
static const char *devName = "/dev/i2c-1";
int file;

void onReceive(void) {
	char buf[1];
	if (read(file, buf, 1) == 1) {
		int temp = (int) buf[0];
		printf("Received %d\n", temp);
	}
	printf("Please enter a number 0-255: ");
}

int main(int argc, char** argv) {
	int num;
	printf("I2C: Connecting\n");
	if ((file = open(devName, O_RDWR)) < 0) {
		fprintf(stderr, "I2C: Failed to access %d\n", devName);
		exit(1);
	}

	printf("I2C: acquiring buss to 0x%x\n", ADDRESS);
	if (ioctl(file, I2C_SLAVE, ADDRESS) < 0) {
		fprintf(stderr, "I2C: Failed to acquire bus access/talk to slave 0x%x\n", ADDRESS);
		exit(1);
	}

	printf("Setup wiringPi...\n");
	if (wiringPiSetup() < 0) {
		fprintf(stderr, "Unable to setup wiringPi: %s\n", strerror(errno));
		exit(1);
	}

	pinMode(0, INPUT);
	pullUpDnControl(0, PUD_DOWN);

	printf("Setup ISR...\n");
	if (wiringPiISR(0, INT_EDGE_BOTH, &onReceive) < 0) {
		fprintf(stderr, "Unable to setup ISR: %s\n", strerror(errno));
		exit(1);
	}

	printf("Please enter a number 0-255: ");
	while (scanf("%d", &num) == 1) {
		printf("Sending %d\n", num);
		if (write(file, &num, 1) != 1) {
			fprintf(stderr, "Writing Error!\n");
		}
		usleep(100000);
	}
}

