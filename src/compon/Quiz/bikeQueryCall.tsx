import { getBikes } from "@/app/_actions/actions";
import { bikeStats, modelDataWBikeStats, queryData } from "../interfaces";
import { LazybikeStats } from "@/models";

export const grabQueriedBikes = async (minEngineSize: number, maxEngineSize: number, categories: string[], excludeToughMaintBikes: boolean, minYear: number, maxYear: number, minAvgMonths: number, maxAvgMonths: number, brandNationality: string) => {
    const brands = new Set<string>();
    if (brandNationality === "asian") {
        brands.add("yamaha");
        brands.add("suzuki");
        brands.add("cfmoto");
        brands.add("honda");
        brands.add("kawasaki");
    }
    else if (brandNationality === "european") {
        brands.add("bmw");
        brands.add("triumph");
        brands.add("aprilia");
        brands.add("ducati");
        brands.add("ktm");
        brands.add("husqvarna");
        brands.add("mv augusta");
        brands.add("vespa");
    }
    else if (brandNationality === "american") {
        brands.add("harley-davidson");
        brands.add("indian");
    }
    else {
        brands.add("aprilia");
    }

    if (excludeToughMaintBikes) {
        brands.delete("ducati");
        brands.delete("aprilia");
        brands.delete("triumph");
    }
    console.log("the size" + brands.size);
    const queryData: queryData = {
        minEngineSize: minEngineSize,
        maxEngineSize: maxEngineSize,
        categories: categories,
        brands: brands,
        minYear: minYear,
        maxYear: maxYear,
        minAvgMonths: minAvgMonths,
        maxAvgMonths: maxAvgMonths,
    }

    const bikes: modelDataWBikeStats[] = await getBikes(queryData, categories);


    console.log("made itrit ");
    return bikes;


}