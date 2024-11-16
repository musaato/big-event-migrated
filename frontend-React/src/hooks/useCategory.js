import { useState, useEffect } from "react";
import { articleCategoryListService } from "@/api/article";

function useCategory() {

    const [categoryList, setCategoryList] = useState([])
    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                const result = await articleCategoryListService()
                setCategoryList(result.data)
            } catch (error) {
                console.log(" error occurred during fetching category list")
            }
        }
        fetchCategoryList()
    }, [])

    return { categoryList, setCategoryList }

}
export { useCategory }