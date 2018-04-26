import { dashCaseToCamelCase } from '@angular/compiler/src/util';

/**
 * Wrapper Class for Projects
 */
export class Project {

    private name: string;
    private address: string;
    private shortDescription: string;
    private longDescription: string;
    private dueTo: Date;
    private limit: number;
    private raised: number;
    private projectAddress: string;

    constructor(
        name: string,
        address: string,
        shortDescription: string,
        longDescription: string,
        dueTo: Date,
        limit: number,
        raised: number,
        projectAddress: string
      ) {
        this.name = name;
        this.address = address;
        this.shortDescription = shortDescription;
        this.longDescription = longDescription;
        this.dueTo = dueTo;
        this.limit = limit;
        this.raised = raised;
        this.projectAddress = projectAddress;
    }

    public getName(): string {
        return this.name;
    }

    public getAddress(): string {
        return this.address;
    }

    public getProjectAddress(): string {
        return this.projectAddress;
    }

    public getShortDescription(): string {
        return this.shortDescription;
    }

    public getLongDescription(): string {
        return this.longDescription;
    }

    public getLimit(): number {
        return this.limit;
    }

    public getRaised(): number {
        return this.raised;
    }

    public getDiffToGoal(): number {
        return this.limit - this.raised;
    }

    public getDaysLeft(): number {
        const today = new Date();
        const time = this.dueTo.getTime() - today.getTime();
        let daysDiff = Math.floor(time / (60 * 60 * 1000 * 24));
        if (daysDiff < 0) {
            daysDiff = 0;
        }
        return (daysDiff);
    }

    public getHoursLeft(): number {
        const today = new Date();
        let time = this.dueTo.getTime() - today.getTime();
        let daysDiff = Math.floor(time / (60 * 60 * 1000 * 24));
        if (daysDiff < 0) {
            daysDiff = 0;
        }
        time = time -  daysDiff * (60 * 60 * 1000 * 24);
        let hoursLeft = Math.floor(time / (60 * 60 * 1000));
        if (hoursLeft < 0) {
            hoursLeft = 0;
        }
        return (hoursLeft);
    }

    public getPaidPercentage(): number {
        let percentage = Math.floor((this.raised / this.limit) * 100);
        if (percentage < 0) {
            percentage = 0;
        } else if (percentage > 100) {
            percentage = 100;
        }
        return percentage;
    }

}
