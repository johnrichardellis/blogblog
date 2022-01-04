package rocks.zipcode.blogblog;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("rocks.zipcode.blogblog");

        noClasses()
            .that()
            .resideInAnyPackage("rocks.zipcode.blogblog.service..")
            .or()
            .resideInAnyPackage("rocks.zipcode.blogblog.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..rocks.zipcode.blogblog.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
